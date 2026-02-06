import React, { useState } from "react";
import {
  UserCircleIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  PhotoIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../Components/AppSidebar";
import AppHeader from "../Components/AppHeader";
import AppFooter from "../Components/AppFooter";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import api from "../utils/api";

// List of specializations for the dropdown
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

// List of designations for the dropdown
const designations = [
  "Doctor",
  "Nurse",
  "Administrator",
  "Lab Technician",
  "Pharmacist",
];

function AddStaff() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [staffData, setStaffData] = useState({
    id: uuidv4(),
    epfNumber: "",
    name: "",
    designation: "",
    experience: "",
    gender: "",
    profileImage: null,
    contactNo: "",
    primarySpecialization: "",
    secondarySpecialization: "",
    medicalLicenseNumber: "",
    licenseExpiryDate: "",
    qualifications: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStaffData((prevData) => ({
          ...prevData,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!staffData.name) errors.name = "Full Name is required.";
    if (!staffData.epfNumber) errors.epfNumber = "EPF Number is required.";
    if (!staffData.designation) errors.designation = "Designation is required.";
    if (!staffData.contactNo) errors.contactNo = "Phone Number is required.";

    if (
      staffData.designation === "Doctor" ||
      staffData.designation === "Nurse"
    ) {
      if (!staffData.medicalLicenseNumber)
        errors.medicalLicenseNumber =
          "Medical License Number is required for Doctors and Nurses.";
      if (!staffData.qualifications)
        errors.qualifications =
          "Qualifications are required for Doctors and Nurses.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      // License expiry validation
      if (staffData.licenseExpiryDate) {
        const today = new Date();
        const expiry = new Date(staffData.licenseExpiryDate);
        if (expiry < today) {
          toast.error("License expiry date cannot be in the past!");
          return;
        }
      }

      // Prepare data to send
      const newStaff = {
        ...staffData,
        id: uuidv4(),
        createdDate: new Date().toISOString(),
        status: "Active",
      };

      // uploading an image file
      const formData = new FormData();
      for (const key in newStaff) {
        formData.append(key, newStaff[key]);
      }

      // POST request to backend
      const res = await api.post(
        "/staff/add",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201 || res.status === 200) {
        toast.success(" Staff member added successfully!");
        setTimeout(() => navigate("/ManageStaff"), 1000);
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      // Reset form after success
      setStaffData({
        id: uuidv4(),
        epfNumber: "",
        name: "",
        designation: "",
        experience: "",
        gender: "",
        profileImage: null,
        contactNo: "",
        primarySpecialization: "",
        secondarySpecialization: "",
        medicalLicenseNumber: "",
        licenseExpiryDate: "",
        qualifications: "",
      });

      setFormErrors({});
    } catch (err) {
      console.error("Error saving staff:", err);
      toast.error(
        " Failed to save staff member. Check the console for details."
      );
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const RequiredLabel = ({ htmlFor, children, isRequired }) => (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700"
    >
      {children}
      {isRequired && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <AppSidebar
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={closeSidebar}
        currentPage="Add Staff"
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
                <UserCircleIcon className="w-8 h-8 mr-3 text-red-500" />
                Add New Staff Member
              </h1>
            </div>
            <form className="p-6 space-y-8" onSubmit={handleSubmit}>
              {/* Basic Info Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-bold text-gray-700 flex items-center mb-4">
                  <UserCircleIcon className="w-6 h-6 mr-2 text-gray-500" />
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <RequiredLabel htmlFor="name" isRequired={true}>
                      Full Name
                    </RequiredLabel>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={staffData.name}
                      onChange={handleChange}
                      className={`mt-1 block w-full py-1.5 px-2.5 text-sm border rounded-md shadow-sm focus:outline-none ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <RequiredLabel htmlFor="epfNumber" isRequired={true}>
                      EPF Number
                    </RequiredLabel>
                    <input
                      type="text"
                      name="epfNumber"
                      id="epfNumber"
                      value={staffData.epfNumber}
                      onChange={handleChange}
                      className={`mt-1 block w-full py-1.5 px-2.5 text-sm border rounded-md shadow-sm focus:outline-none ${
                        formErrors.epfNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.epfNumber && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.epfNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <RequiredLabel htmlFor="designation" isRequired={true}>
                      Designation
                    </RequiredLabel>
                    <select
                      name="designation"
                      id="designation"
                      value={staffData.designation}
                      onChange={handleChange}
                      className={`mt-1 block w-full py-1.5 px-2.5 text-sm border rounded-md shadow-sm focus:outline-none ${
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
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      id="experience"
                      value={staffData.experience}
                      onChange={handleChange}
                      className="mt-1 block w-full py-1.5 px-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <RequiredLabel htmlFor="Gender" isRequired={true}>
                      Gender
                    </RequiredLabel>
                    <select
                      name="gender"
                      id="gender"
                      value={staffData.gender}
                      onChange={handleChange}
                      className="mt-1 block w-full py-1.5 px-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <RequiredLabel htmlFor="contactNo" isRequired={true}>
                      Phone Number
                    </RequiredLabel>
                    <input
                      type="tel"
                      name="contactNo"
                      id="contactNo"
                      value={staffData.contactNo}
                      onChange={handleChange}
                      placeholder="e.g., +94771234567"
                      className={`mt-1 block w-full py-1.5 px-2.5 text-sm border rounded-md shadow-sm focus:outline-none ${
                        formErrors.contactNo
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.contactNo && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.contactNo}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="profileImage"
                      className="block text-sm font-medium text-gray-700"
                    >
                      <PhotoIcon className="w-4 h-4 inline-block mr-1 text-gray-500" />
                      Profile Image
                    </label>
                    <div className="mt-2 flex items-center">
                      {staffData.profileImage ? (
                        <img
                          src={staffData.profileImage}
                          alt="Profile Preview"
                          className="h-20 w-20 rounded-full object-cover mr-4 border-2 border-gray-200"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-gray-200">
                          <UserCircleIcon className="h-12 w-12" />
                        </div>
                      )}
                      <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-2.5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Professional Details Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-bold text-gray-700 flex items-center mb-4">
                  <BriefcaseIcon className="w-6 h-6 mr-2 text-gray-500" />
                  Professional Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Primary Specialization
                    </label>
                    <select
                      name="primarySpecialization"
                      id="primarySpecialization"
                      value={staffData.primarySpecialization}
                      onChange={handleChange}
                      className={`mt-1 block w-full py-1.5 px-2.5 text-sm border rounded-md shadow-sm focus:outline-none ${
                        formErrors.primarySpecialization
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select specialization</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    {formErrors.primarySpecialization && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.primarySpecialization}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="secondarySpecialization"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Secondary Specialization (Optional)
                    </label>
                    <select
                      name="secondarySpecialization"
                      id="secondarySpecialization"
                      value={staffData.secondarySpecialization}
                      onChange={handleChange}
                      className="mt-1 block w-full py-1.5 px-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
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
                    <RequiredLabel
                      htmlFor="medicalLicenseNumber"
                      isRequired={
                        staffData.designation === "Doctor" ||
                        staffData.designation === "Nurse"
                      }
                    >
                      Medical License Number
                    </RequiredLabel>
                    <input
                      type="text"
                      name="medicalLicenseNumber"
                      id="medicalLicenseNumber"
                      value={staffData.medicalLicenseNumber}
                      onChange={handleChange}
                      className={`mt-1 block w-full py-1.5 px-2.5 text-sm border rounded-md shadow-sm focus:outline-none ${
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
                    <label
                      htmlFor="licenseExpiryDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      License Expiry Date
                    </label>
                    <input
                      type="date"
                      name="licenseExpiryDate"
                      id="licenseExpiryDate"
                      value={staffData.licenseExpiryDate}
                      onChange={handleChange}
                      className="mt-1 block w-full py-1.5 px-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>
              {/* Qualifications Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-700 flex items-center mb-4">
                  <AcademicCapIcon className="w-6 h-6 mr-2 text-gray-500" />
                  Qualifications
                </h2>
                <div className="space-y-4">
                  <div>
                    <RequiredLabel
                      htmlFor="qualifications"
                      isRequired={
                        staffData.designation === "Doctor" ||
                        staffData.designation === "Nurse"
                      }
                    >
                      Add Qualifications (e.g., MBBS, MD, PhD, etc.)
                    </RequiredLabel>
                    <textarea
                      id="qualifications"
                      name="qualifications"
                      rows="4"
                      value={staffData.qualifications}
                      onChange={handleChange}
                      placeholder="Enter qualifications, one per line or separated by commas."
                      className={`mt-1 block w-full py-1.5 px-2.5 text-sm border rounded-md shadow-sm focus:outline-none ${
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
              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <AppFooter />
      </main>
    </div>
  );
}

export default AddStaff;
