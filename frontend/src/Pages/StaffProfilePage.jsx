import api from "../utils/api";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import AppSidebar from "../Components/AppSidebar";
import AppHeader from "../Components/AppHeader";
import AppFooter from "../Components/AppFooter";

function StaffProfilePage() {
  const [staffProfile, setStaffProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const defaultPlaceholderImage =
    "https://placehold.co/150x150/E0E7FF/4338CA?text=User";

  useEffect(() => {
    if (!token || !userId || !role) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const endpoint =
          role === "staff"
            ? `/staff/${userId}`
            : role === "patient"
            ? `/patients/${userId}`
            : null;

        if (!endpoint) return;

        const response = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStaffProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [token, role, userId, navigate]);

  const currentProfileImageSrc =
    profileImage || staffProfile?.profileImage || staffProfile?.profile_image || defaultPlaceholderImage;

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setProfileImage(base64Image);

        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const parsed = JSON.parse(storedUserData);
          parsed.profile_image = base64Image;
          localStorage.setItem("userData", JSON.stringify(parsed));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const DetailRow = ({ label, value }) => (
    <p className="flex justify-between items-start">
      <span className="font-medium text-gray-600 mr-2">{label}:</span>
      <span className="text-gray-800 text-right flex-1 break-words">
        {value || "N/A"}
      </span>
    </p>
  );

  if (!staffProfile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Profile...</h2>
          <p className="text-gray-600 mb-6">Please wait.</p>
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
        <AppHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className="w-full max-w-7xl mx-auto p-4 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight">
              {role === "staff" ? "Staff Profile" : "Patient Profile"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {/* Left Column */}
              <div className="md:col-span-1 flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 shadow-md mb-4">
                  <img
                    src={currentProfileImageSrc}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = defaultPlaceholderImage)}
                  />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <button
                  onClick={triggerFileInput}
                  className="mt-2 mb-4 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-200"
                >
                  Change Profile Picture
                </button>

                <h3 className="text-xl font-semibold text-gray-800 mb-1">{staffProfile.name}</h3>
                <p className="text-sm text-gray-600">{staffProfile.designation || staffProfile.department}</p>

              
              </div>

              {/* Right Column */}
              <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm col-span-1 lg:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
                    Personal Information
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    {role === "staff" ? (
                      <>
                        <DetailRow label="EPF Number" value={staffProfile.epfNumber} />
                        <DetailRow label="Designation" value={staffProfile.designation} />
                        <DetailRow label="Experience" value={staffProfile.experience} />
                        <DetailRow label="Phone" value={staffProfile.contactNo} />
                        <DetailRow label="Primary Specialization" value={staffProfile.primarySpecialization} />
                        <DetailRow label="Secondary Specialization" value={staffProfile.secondarySpecialization} />
                        <DetailRow label="Medical License #" value={staffProfile.medicalLicenseNumber} />
                        <DetailRow label="License Expiry" value={staffProfile.licenseExpiryDate} />
                        <DetailRow label="Qualifications" value={staffProfile.qualifications} />
                      </>
                    ) : (
                      <>
                        <DetailRow label="EPF Number" value={staffProfile.epfNo} />
                        <DetailRow label="Department" value={staffProfile.department} />
                        <DetailRow label="Phone" value={staffProfile.contactNo} />
                        <DetailRow label="Date of Birth" value={staffProfile.dateOfBirth} />
                      </>
                    )}
                  </div>
                </div>

                {/* Account Info */}
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm col-span-1 lg:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Account Information</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <DetailRow label="Role" value={role} />
                    <DetailRow
                      label="Status"
                      value={<span className="text-green-600 font-semibold">{staffProfile.status || "Active"}</span>}
                    />
                     <button
                  onClick={() => setShowChangePassword(true)}
                  className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Change Password
                </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 flex justify-end">
              <button
                onClick={() => navigate(-1)}
                className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
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
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Change Password</h3>

              

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
                  {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
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
                  {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>

              {/* Messages */}
              {passwordError && <p className="text-red-600 text-sm mb-2">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-600 text-sm mb-2">{passwordSuccess}</p>}

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
                    const identifier =
                      role === "patient" ? staffProfile.epfNo : staffProfile.username || staffProfile.epfNumber;

                    await api.put(
                      "/auth/change-password",
                      {
                        userType: role,
                        identifier,
                        newPassword,
                      },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );

                    setPasswordSuccess("Password updated successfully");
                    setPasswordError("");
                    setNewPassword("");
                    setConfirmPassword("");

                    setTimeout(() => setShowChangePassword(false), 1500);
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

export default StaffProfilePage;
