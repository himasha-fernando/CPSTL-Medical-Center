
import React from "react";
import {
  UserCircleIcon,
  EyeIcon,
  XMarkIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  PhoneIcon,
  CalendarIcon,
  DocumentTextIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

const ViewStaffModal = ({ staff, isOpen, onClose, onEdit }) => {
  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <EyeIcon className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">View Staff Details</h2>
                <p className="text-red-100 text-sm">
                  {staff.name} - {staff.epfNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="p-2 hover:bg-red-700 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {/* Profile Section */}
          <div className="mb-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <UserCircleIcon className="w-6 h-6 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="flex items-start space-x-6">
              {staff.profileImage ? (
                <img
                  src={staff.profileImage}
                  alt={staff.name}
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                  <UserCircleIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-semibold text-gray-900">
                    {staff.name || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">EPF Number</p>
                  <p className="font-semibold text-gray-900">
                    {staff.epfNumber || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-semibold text-gray-900">
                    {staff.gender || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="font-semibold text-gray-900 flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-1 text-gray-400" />
                    {staff.contactNo || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="mb-6 bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <BriefcaseIcon className="w-6 h-6 mr-2 text-green-600" />
              Professional Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-semibold text-gray-900">
                  {staff.designation || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-semibold text-gray-900">
                  {staff.experience ? `${staff.experience} years` : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Primary Specialization</p>
                <p className="font-semibold text-gray-900">
                  {staff.primarySpecialization || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Secondary Specialization
                </p>
                <p className="font-semibold text-gray-900">
                  {staff.secondarySpecialization || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* License Information */}
          {(staff.designation === "Doctor" ||
            staff.designation === "Nurse") && (
            <div className="mb-6 bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <DocumentTextIcon className="w-6 h-6 mr-2 text-purple-600" />
                License Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">
                    Medical License Number
                  </p>
                  <p className="font-semibold text-gray-900">
                    {staff.medicalLicenseNumber || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">License Expiry Date</p>
                  <p className="font-semibold text-gray-900 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1 text-gray-400" />
                    {staff.licenseExpiryDate
                      ? new Date(staff.licenseExpiryDate).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Qualifications */}
          <div className="mb-6 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <AcademicCapIcon className="w-6 h-6 mr-2 text-yellow-600" />
              Qualifications
            </h3>
            <div>
              <p className="font-semibold text-gray-900 whitespace-pre-line">
                {staff.qualifications || "No qualifications listed"}
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold text-gray-900">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      staff.status === "Active"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : staff.status === "On Leave"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {staff.status || "Active"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date Added</p>
                <p className="font-semibold text-gray-900">
                  {staff.createdDate
                    ? new Date(staff.createdDate).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <div className="text-sm text-gray-500">View staff information</div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStaffModal;
