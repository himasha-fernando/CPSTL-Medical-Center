// src/Components/AppSidebarNav.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Home, UserCheck, UserPlus, BarChart3, FileText } from "lucide-react";

const adminNavItems = [
  { name: "Dashboard", icon: Home, link: "/Dashboard" },
  { name: "Manage Patients", icon: UserCheck, link: "/ManagePatients" },
  { name: "Manage Staff", icon: UserPlus, link: "/ManageStaff" },
  { name: "Patient Count", icon: BarChart3, link: "/PatientCount" },
];

const userNavItems = [
  { name: "Dashboard", icon: Home, link: "/UserDashboard" },
  { name: "My Reports", icon: FileText, link: "/MyReports" },
];

const AppSidebarNav = ({
  onNavLinkClick,
  currentPage,
  isSidebarOpen,
  userRole,
}) => {
  const handleLinkClick = () => {
    if (onNavLinkClick) onNavLinkClick();
  };

  const navItems = userRole === "admin" ? adminNavItems : userNavItems;

  return (
    <nav className="flex-1 px-4 py-6 text-gray-900 space-y-2">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.link}
          className={`flex items-center rounded-md transition duration-200 hover:bg-gray-100 hover:text-red-600 
            ${
              currentPage === item.name ||
              window.location.pathname === item.link
                ? "bg-red-600 text-white font-semibold"
                : "text-gray-700"
            } ${
            isSidebarOpen ? "px-3 py-2 justify-start" : "p-2 justify-center"
          }`}
          onClick={handleLinkClick}
        >
          <item.icon className={`w-5 h-5 ${isSidebarOpen ? "mr-3" : ""}`} />
          {isSidebarOpen && <span className="pl-2">{item.name}</span>}
        </Link>
      ))}
    </nav>
  );
};

export default AppSidebarNav;
