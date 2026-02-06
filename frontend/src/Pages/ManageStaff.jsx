import React, { useEffect, useState } from "react";
import {
  UserCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import AppSidebar from "../Components/AppSidebar";
import AppHeader from "../Components/AppHeader";
import AppFooter from "../Components/AppFooter";
import ViewStaffModal from "../Components/ViewStaffModal";
import EditStaffModal from "../Components/EditStaffModal";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";

      case "Inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ status, onToggle }) => {
  const isChecked = status === "Active";
  return (
    <label
      htmlFor={`toggle-${onToggle}`}
      className="flex items-center cursor-pointer"
    >
      <div className="relative">
        <input
          id={`toggle-${onToggle}`}
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={onToggle}
        />
        <div
          className={`block w-10 h-6 rounded-full ${
            isChecked ? "bg-green-600" : "bg-red-300"
          }`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
            isChecked ? "translate-x-4" : "translate-x-0"
          }`}
        ></div>
      </div>
    </label>
  );
};

function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const staffPerPage = 10;

  const navigate = useNavigate();

  // Load staff from localStorage
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await api.get("/staff");
        const staffData = response.data.map((member) => ({
          ...member,
          status: member.status || "Active",
        }));
        setStaff(staffData);
        setFilteredStaff(staffData);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, []);

  // Search and filter
  useEffect(() => {
    let filtered = staff;

    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          (member.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (member.epfNumber || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (member.contactNo || "").includes(searchTerm) ||
          (member.medicalLicenseNumber || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (filterDesignation !== "all") {
      filtered = filtered.filter(
        (member) => member.designation === filterDesignation
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((member) => member.status === filterStatus);
    }

    setFilteredStaff(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterDesignation, filterStatus, staff]);

  // Pagination
  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaffList = filteredStaff.slice(
    indexOfFirstStaff,
    indexOfLastStaff
  );
  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);

  // Actions
  const handleView = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsViewModalOpen(true);
  };

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsEditModal(true);
  };

  const handleSaveEdit = async (editedStaff) => {
    try {
      // Send updated staff to backend
      await api.put(
        `/staff/update/${editedStaff.id}`,
        editedStaff
      );

      // Update local state
      const updatedStaff = staff.map((s) =>
        s.id === editedStaff.id ? editedStaff : s
      );
      setStaff(updatedStaff);

      alert("Staff information updated successfully!");
      setIsEditModal(false);
    } catch (error) {
      console.error("Error updating staff:", error);
      alert("Failed to update staff information.");
    }
  };

  const handleDelete = async (staffId) => {
    if (!window.confirm("Are you sure you want to delete this staff member?"))
      return;

    try {
      // Call backend API to delete staff
      await api.delete(`/staff/${staffId}`);

      // Update local state after successful deletion
      const updatedStaff = staff.filter((s) => s.id !== staffId);
      setStaff(updatedStaff);

      alert("Staff member deleted successfully!");
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Failed to delete staff member.");
    }
  };

  const handleToggleStatus = (staffId) => {
    const updated = staff.map((s) => {
      if (s.id !== staffId) return s;
      const newStatus = s.status === "Active" ? "Inactive" : "Active";
      return {
        ...s,
        status: newStatus,
        lastUpdated: new Date().toISOString(),
      };
    });
    setStaff(updated);
    localStorage.setItem("staff", JSON.stringify(updated));
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const designations = [
    "Doctor",
    "Nurse",
    "Administrator",
    "Lab Technician",
    "Pharmacist",
  ];

  const handleAddStaffClick = () => {
    navigate("/AddStaff");
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <AppSidebar
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={closeSidebar}
        currentPage="Manage Staff"
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex items-center">
                  <UserCircleIcon className="w-8 h-8 mr-3 text-red-500" />
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Manage Staff
                  </h1>
                </div>
                <button
                  onClick={handleAddStaffClick}
                  className="mt-4 md:mt-0 px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Add Staff
                </button>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm text-gray-600">Total Staff:</span>
                <span className="text-lg font-semibold text-red-600">
                  {staff.length}
                </span>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name, EPF number, or contact..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <FunnelIcon className="w-5 h-5 text-gray-500" />
                  <select
                    value={filterDesignation}
                    onChange={(e) => setFilterDesignation(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">All Designations</option>
                    {designations.map((designation) => (
                      <option key={designation} value={designation}>
                        {designation}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {currentStaffList.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EPF No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Staff Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Designation
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Specialization
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentStaffList.map((member) => (
                        <tr
                          key={member.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {member.epfNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {member.profileImage ? (
                                <img
                                  src={member.profileImage}
                                  alt={member.name}
                                  className="h-10 w-10 rounded-full object-cover mr-3"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                  <UserCircleIcon className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {member.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {member.gender}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {member.designation}
                            </div>
                            <div className="text-sm text-gray-500">
                              {member.experience} years exp.
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.primarySpecialization || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <PhoneIcon className="w-4 h-4 mr-1 text-gray-400" />
                              {member.contactNo}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <ToggleSwitch
                                status={member.status}
                                onToggle={() => handleToggleStatus(member.id)}
                              />
                              <span
                                className={`text-sm font-medium ${
                                  member.status === "Active"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {member.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleView(member)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                title="View Details"
                              >
                                <EyeIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleEdit(member)}
                                className="p-1 text-yellow-600 hover:bg-yellow-100 rounded transition-colors"
                                title="Edit"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(member.id)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                title="Delete"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      No staff members found
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {searchTerm ||
                      filterDesignation !== "all" ||
                      filterStatus !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "Add a new staff member to get started"}
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {indexOfFirstStaff + 1} to{" "}
                      {Math.min(indexOfLastStaff, filteredStaff.length)} of{" "}
                      {filteredStaff.length} staff members
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`p-2 rounded ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }`}
                      >
                        <ChevronLeftIcon className="w-5 h-5" />
                      </button>

                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 rounded ${
                                currentPage === page
                                  ? "bg-red-500 text-white"
                                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-1">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }`}
                      >
                        <ChevronRightIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <AppFooter />
      </main>

      {/* Modals */}
      <ViewStaffModal
        staff={selectedStaff}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={() => {
          setIsViewModalOpen(false);
          setIsEditModal(true);
        }}
      />

      <EditStaffModal
        staff={selectedStaff}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModal(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default ManageStaff;
