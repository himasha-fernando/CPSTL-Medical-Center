import React from "react";
import AppSidebarNav from "./AppSidebarNav";

const AppSidebar = ({ isSidebarOpen, onCloseSidebar, currentPage }) => {
  // Retrieve user data from localStorage
  const storeData = localStorage.getItem("userData");
  const userRoleFromStorage = localStorage.getItem("role");
  let userData = null;

  if (storeData) {
    try {
      userData = JSON.parse(storeData);
    } catch {
      userData = null;
    }
  }

  const userName = userData?.name || "User";
  const role = userRoleFromStorage || "user";

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={onCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white text-gray-900 shadow-xl transform transition-transform duration-300 z-50 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:w-20"
        }`}
      >
        {/* Logo */}
        <div
          className={`p-4 flex flex-col items-center justify-center border-b border-gray-200 ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <div className="flex items-center">
            <img
              src="public/medi.jpeg"
              alt="CPSTL MedRecord Logo"
              className={`object-cover transition-all duration-300 ${
                isSidebarOpen ? "w-19 h-20 mr-2" : "w-20 h-30"
              }`}
            />
            {isSidebarOpen && (
              <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap">
                CPSTL MedRecord
              </h2>
            )}
          </div>
        </div>

        {/* User Profile */}
        {isSidebarOpen && (
          <div className="p-4 flex flex-col items-center border-b border-gray-200">
            <img
              src={
                userData?.profile_image ||
                "https://placehold.co/80x80/cccccc/333333?text=👤"
              }
              alt="User Profile"
              className="object-cover w-20 h-20 mb-2 border-2 border-gray-300 rounded-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/80x80/cccccc/333333?text=👤";
              }}
            />
            <p className="text-xs text-gray-600 uppercase">{userData?.name}</p>
          </div>
        )}

        {/* Navigation */}
        <AppSidebarNav
          onNavLinkClick={onCloseSidebar}
          currentPage={currentPage}
          isSidebarOpen={isSidebarOpen}
          userRole={role}
        />
      </aside>
    </>
  );
};

export default AppSidebar;
