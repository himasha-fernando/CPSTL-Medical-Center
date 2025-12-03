import React, { useEffect, useState } from "react";
import {
  UserCircleIcon,
  XMarkIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  PhotoIcon,
  CheckIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const EditStaffModal = ({ staff, isOpen, onClose, onSave }) => {
  const [editedStaff, setEditedStaff] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const specializations = [
    "General Practitioner",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Surgeon",
    "Pediatrician",
    "Psychiatrist",
    "Gynecologist",
    "Radiologist",
    "Nurse",
    "Lab Technician",
    "Pharmacist",
    "Other",
  ];

  const designations = [
    "Doctor",
    "Nurse",
    "Administrator",
    "Lab Technician",
    "Pharmacist",
  ];

  useEffect(() => {
    if (staff) {
      setEditedStaff({ ...staff });
      setFormErrors({});
    }
  }, [staff]);

  if (!isOpen || !staff) return null;

  const handleInputChange = (field, value) => {
    setEditedStaff((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedStaff((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validation
  const validateForm = () => {
    const errors = {};

    if (!editedStaff.name || editedStaff.name.trim() === "") {
      errors.name = "Full Name is required.";
    }

    if (!editedStaff.epfNumber || editedStaff.epfNumber.trim() === "") {
      errors.epfNumber = "EPF Number is required.";
    }

    if (!editedStaff.designation) {
      errors.designation = "Designation is required.";
    }

    if (!editedStaff.contactNo || editedStaff.contactNo.trim() === "") {
      errors.contactNo = "Phone Number is required.";
    } else if (!/^[+]?[\d\s-()]+$/.test(editedStaff.contactNo)) {
      errors.contactNo = "Please enter a valid phone number.";
    }

    if (
      editedStaff.designation === "Doctor" ||
      editedStaff.designation === "Nurse"
    ) {
      if (
        !editedStaff.medicalLicenseNumber ||
        editedStaff.medicalLicenseNumber.trim() === ""
      ) {
        errors.medicalLicenseNumber =
          "Medical License Number is required for Doctors and Nurses.";
      }
      if (
        !editedStaff.qualifications ||
        editedStaff.qualifications.trim() === ""
      ) {
        errors.qualifications =
          "Qualifications are required for Doctors and Nurses.";
      }
    }

    if (
      editedStaff.experience &&
      (isNaN(editedStaff.experience) || editedStaff.experience < 0)
    ) {
      errors.experience = "Please enter a valid experience in years.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(editedStaff);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UserCircleIcon className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Edit Staff Details</h2>
                <p className="text-red-100 text-sm">Editing: {staff.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-700 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {/* Personal Information */}
          <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <UserCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editedStaff.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  EPF Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editedStaff.epfNumber || ""}
                  onChange={(e) =>
                    handleInputChange("epfNumber", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.epfNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.epfNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.epfNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={editedStaff.gender || "Male"}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={editedStaff.contactNo || ""}
                  onChange={(e) =>
                    handleInputChange("contactNo", e.target.value)
                  }
                  placeholder="e.g., +94771234567"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.contactNo ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.contactNo && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.contactNo}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Image */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <PhotoIcon className="w-4 h-4 inline-block mr-1 text-gray-500" />
                Profile Image
              </label>
              <div className="flex items-center space-x-4">
                {editedStaff.profileImage ? (
                  <img
                    src={editedStaff.profileImage}
                    alt="Profile Preview"
                    className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-gray-200">
                    <UserCircleIcon className="h-12 w-12" />
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-2.5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="mb-6 bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <BriefcaseIcon className="w-5 h-5 mr-2 text-green-600" />
              Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation <span className="text-red-500">*</span>
                </label>
                <select
                  value={editedStaff.designation || ""}
                  onChange={(e) =>
                    handleInputChange("designation", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                    formErrors.designation
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select a designation</option>
                  {designations.map((designation) => (
                    <option key={designation} value={designation}>
                      {designation}
                    </option>
                  ))}
                </select>
                {formErrors.designation && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.designation}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editedStaff.experience || ""}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                    formErrors.experience ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.experience && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.experience}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Specialization
                </label>
                <select
                  value={editedStaff.primarySpecialization || ""}
                  onChange={(e) =>
                    handleInputChange("primarySpecialization", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Specialization
                </label>
                <select
                  value={editedStaff.secondarySpecialization || ""}
                  onChange={(e) =>
                    handleInputChange("secondarySpecialization", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editedStaff.status || "Active"}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* License Information - Only for Doctors and Nurses */}
          {(editedStaff.designation === "Doctor" ||
            editedStaff.designation === "Nurse") && (
            <div className="mb-6 bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-purple-600" />
                License Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical License Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editedStaff.medicalLicenseNumber || ""}
                    onChange={(e) =>
                      handleInputChange("medicalLicenseNumber", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                      formErrors.medicalLicenseNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.medicalLicenseNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.medicalLicenseNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Expiry Date
                  </label>
                  <input
                    type="date"
                    value={editedStaff.licenseExpiryDate || ""}
                    onChange={(e) =>
                      handleInputChange("licenseExpiryDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Qualifications */}
          <div className="mb-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <AcademicCapIcon className="w-5 h-5 mr-2 text-yellow-600" />
              Qualifications
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualifications{" "}
                {(editedStaff.designation === "Doctor" ||
                  editedStaff.designation === "Nurse") && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <textarea
                rows={4}
                value={editedStaff.qualifications || ""}
                onChange={(e) =>
                  handleInputChange("qualifications", e.target.value)
                }
                placeholder="Enter qualifications, one per line or separated by commas (e.g., MBBS, MD, PhD)"
                className={`w-full px-3 py-2 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 ${
                  formErrors.qualifications
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formErrors.qualifications && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.qualifications}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <div className="text-sm text-gray-500">* Required fields</div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors flex items-center font-medium shadow-lg"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStaffModal;
