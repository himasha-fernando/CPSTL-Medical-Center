import api from "../utils/api";
import React, { useState, useEffect, useRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../Components/AppSidebar";
import AppHeader from "../Components/AppHeader";
import AppFooter from "../Components/AppFooter";

function ProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const [profileImage, setProfileImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [showChangePassword, setShowChangePassword] = useState(false);
const [epfNo, setEpfNo] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordError, setPasswordError] = useState("");
const [passwordSuccess, setPasswordSuccess] = useState("");
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  useEffect(() => {
    if (!token || !userId || !role) {
      // redirect to login if no token
      window.location.href = "/login";
      return;
    }

    // Fetch full user details
    const fetchProfile = async () => {
      try {
        const endpoint =
          role === "admin"
            ? `/auth/admin/${userId}`
            : `/auth/patient/${userId}`;

        const response = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [token, role, userId]);

  const defaultPlaceholderImage =
    "https://placehold.co/150x150/E0E7FF/4338CA?text=User";
  const currentProfileImageSrc =
    profileImage || userProfile?.profile_image || defaultPlaceholderImage;

  //  Handle new image upload & save to localStorage
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;

        // Save separately for ProfilePage
        setProfileImage(base64Image);
        localStorage.setItem("profileImage", base64Image);

        // Also update inside userData
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          parsedData.profile_image = base64Image;
          localStorage.setItem("userData", JSON.stringify(parsedData));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Reusable detail row
  const DetailRow = ({ label, value }) => (
    <p className="flex justify-between items-start">
      <span className="font-medium text-gray-600 mr-2">{label}:</span>
      <span className="text-gray-800 text-right flex-1 break-words">
        {value || "N/A"}
      </span>
    </p>
  );

  // If profile not loaded
  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Loading Profile...
          </h2>
          <p className="text-gray-600 mb-6">
            If you are not redirected, please log in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <AppSidebar
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        currentPage="Profile"
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="w-full max-w-7xl mx-auto p-4 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight">
              Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {/* Left Column: Profile Picture & Shortcuts */}
              <div className="md:col-span-1 flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 shadow-md mb-4">
                  <img
                    src={currentProfileImageSrc}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultPlaceholderImage;
                    }}
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <button
                  onClick={triggerFileInput}
                  className="mt-2 mb-4 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-200"
                >
                  Change Profile Picture
                </button>

                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {userProfile.name || userProfile.name || "User Name"}
                </h3>
              </div>

              {/* Right Columns: Personal & Account */}
              <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm col-span-1 lg:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
                    Personal Information
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <DetailRow
                      label="EPF Number"
                      value={userProfile.epfNumber || userProfile.username}
                    />
                    <DetailRow label="User ID" value={userProfile.id} />
                    <DetailRow
                      label="Department"
                      value={userProfile?.department || "Health"}
                    />
                    <DetailRow
                      label="Name"
                      value={
                        userProfile.Name ||
                        userProfile.name?.split(" ")[0] ||
                        "N/A"
                      }
                    />
                  </div>
                </div>

                {/* Account Information */}
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm col-span-1 lg:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    Account Information
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <DetailRow
                      label="Status"
                      value={
                        <span className="text-green-600 font-semibold">
                          {userProfile.activestatus ? "Active" : "Inactive"}
                        </span>
                      }
                    />
                    <DetailRow
                      label="Role"
                      value={userProfile.role_type || "Doctor"}
                    />
                    <button
  onClick={() => {
    setShowChangePassword(true);
    setEpfNo(userProfile.epfNumber || userProfile.username || "");
  }}
  className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
>
  Change Password
</button>

                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-8 pt-6 border-gray-200 flex justify-end">
              <button
                onClick={() => navigate(-1)}
                className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {showChangePassword && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative">

      {/* Close Icon */}
      <button
        onClick={() => {
          setShowChangePassword(false);
          setPasswordError("");
          setPasswordSuccess("");
        }}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
      >
        ✕
      </button>

      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Change Password
      </h3>

      {/* EPF Number */}
      <div className="mb-3">
        <label className="text-sm text-gray-600">EPF Number</label>
        <input
          type="text"
          value={epfNo}
          readOnly
          className="w-full mt-1 px-3 py-2 border rounded-md bg-gray-100"
        />
      </div>

{/* New Password */}
<div className="mb-3 relative">
  <label className="text-sm text-gray-600">New Password</label>
  <input
    type={showNewPassword ? "text" : "password"}
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 pr-10"
  />
  <button
    type="button"
    onClick={() => setShowNewPassword(!showNewPassword)}
    className="absolute top-8 right-3 text-gray-500 hover:text-gray-700"
  >
    {showNewPassword ? (
      <EyeSlashIcon className="h-5 w-5" />
    ) : (
      <EyeIcon className="h-5 w-5" />
    )}
  </button>
</div>

      {/* Confirm Password */}
<div className="mb-3 relative">
  <label className="text-sm text-gray-600">Confirm Password</label>
  <input
    type={showConfirmPassword ? "text" : "password"}
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 pr-10"
  />
  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute top-8 right-3 text-gray-500 hover:text-gray-700"
  >
    {showConfirmPassword ? (
      <EyeSlashIcon className="h-5 w-5" />
    ) : (
      <EyeIcon className="h-5 w-5" />
    )}
  </button>
</div>

      {/* Messages */}
      {passwordError && (
        <p className="text-red-600 text-sm mb-2">{passwordError}</p>
      )}
      {passwordSuccess && (
        <p className="text-green-600 text-sm mb-2">{passwordSuccess}</p>
      )}

      {/* Save Button */}
      <button
        onClick={async () => {
          if (!newPassword || !confirmPassword) {
            setPasswordError("All fields are required");
            return;
          }

          if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
          }

             try {
      // Determine identifier based on role
      const identifier =
        role === "admin"
          ? userProfile.username   // admin uses username
          : userProfile.epfNumber; // patient uses EPF number

      await api.put(
        "/auth/change-password",
        {
          userType: role,   // admin or patient
          identifier,       
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

            setPasswordSuccess("Password updated successfully");
            setPasswordError("");
            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
              setShowChangePassword(false);
            }, 1500);
          } catch (err) {
            setPasswordError("Failed to update password");
          }
        }}
        className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
      >
        Save Password
      </button>
    </div>
  </div>
)}

        <AppFooter />
      </main>
    </div>
  );
}

export default ProfilePage;
