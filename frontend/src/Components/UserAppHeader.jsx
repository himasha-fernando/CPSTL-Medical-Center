import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import axios from "axios";
import NotificationPanel from "./NotificationPanel";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import RegisterPatient from "../Pages/RegisterPatient";

const defaultPublicProfileIcon = "/pro_icon.png";

const AppHeader = ({ onMenuToggle, isSidebarOpen }) => {
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setUserData({
          ...parsed,
          profile_image: parsed.profile_image || defaultPublicProfileIcon,
        });
      } catch (err) {
        console.error("Error parsing userData:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const storedId = localStorage.getItem("userId");
      const storedRole = localStorage.getItem("userRole");

      if (!storedId || !storedRole) return;

      try {
        let res;
        let user;

        if (storedRole === "patient") {
          res = await axios.get(
            `http://localhost:5000/auth/patient/${storedId}`
          );
          user = res.data;
        } else if (storedRole === "staff") {
          res = await axios.get(`http://localhost:5000/staff/${storedId}`);
          user = res.data;
        } else if (storedRole === "admin") {
          res = await axios.get(`http://localhost:5000/users`);
          user = res.data.find((u) => u.id === parseInt(storedId));
        }

        if (user) {
          setUserData({
            ...user,
            profile_image: user.profile_image || defaultPublicProfileIcon,
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsDropdownOpen(false);
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      )
        setIsNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear all related localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userData");
    localStorage.removeItem("profileImage");

    // Clear React state
    setUserData(null);
    setIsDropdownOpen(false);

    // Clear console
    console.clear();

    // Redirect to login or home page
    navigate("/", { replace: true });

    // Optional alert
    alert("Logged out successfully!");
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate("/StaffProfilePage");
  };

  const profileImage = userData?.profile_image || defaultPublicProfileIcon;

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md rounded-bl-lg ">
      <div className="flex items-center">
        <button
          onClick={onMenuToggle}
          className="mr-4 p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6 text-red-600" />
          ) : (
            <Menu className="w-6 h-6 text-red-600" />
          )}
        </button>
      </div>
      <div className="flex justify-end gap-4 w-full mt-4"></div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              setIsNotificationsOpen((prev) => !prev);
            }}
            className="relative p-2 rounded-full hover:bg-gray-100"
          >
            <Bell className="w-6 h-6 text-red-600 cursor-pointer hover:text-red-800" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            onNotificationRead={() => setUnreadCount(0)}
            onUnreadCountChange={setUnreadCount}
          />
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => {
              setIsNotificationsOpen(false);
              setIsDropdownOpen((prev) => !prev);
            }}
          >
            <img
              src={profileImage}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-red-600"
            />
            <span className="text-gray-700 font-medium">
              {userData ? userData.role_type : ""}
            </span>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <button
                onClick={handleProfileClick}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Profile
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
