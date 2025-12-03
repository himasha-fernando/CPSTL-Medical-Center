import React, { useState } from "react";
import axios from "axios";
import {
  ExclamationCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

function RegisterPatient({ onClose }) {
  const [formData, setFormData] = useState({
    registrationNo: "",
    name: "",
    epfNo: "",
    department: "",
    contactNo: "",
    gender: "",
    dateOfBirth: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.registrationNo)
      newErrors.registrationNo = "Registration No. is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.epfNo) newErrors.epfNo = "EPF No. is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.contactNo) newErrors.contactNo = "Contact No. is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of Birth is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/patients/add", formData);
      setMessage("Patient registered successfully!");
      setFormData({
        registrationNo: "",
        name: "",
        epfNo: "",
        department: "",
        contactNo: "",
        gender: "",
        dateOfBirth: "",
      });
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1000);
    } catch (error) {
      setMessage("Error registering patient. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-2xl relative z-[10000]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
          <UserCircleIcon className="w-6 h-6 mr-2 text-red-500" />
          Patient Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Registration No */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Registration No. <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md ${
                errors.registrationNo
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {errors.registrationNo && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                {errors.registrationNo}
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md ${
                errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          {/* EPF No */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              EPF No. <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="epfNo"
              value={formData.epfNo}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md ${
                errors.epfNo ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.epfNo && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                {errors.epfNo}
              </p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md ${
                errors.department
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select Department</option>
              {[
                "ANURADHAPURA HOLIDAY",
                "AUTO MOBILE",
                "BULK MOVE. & BULK PR",
                "DGM(ENG & SS)",
                "DGM(FINANCE)",
                "DGM(HR & ADMIN)",
                "DGM(O)",
                "DISTRIBUTION",
                "ENGINEERING - DEVE.",
                "FIRE & SAFETY",
                "FINANCE",
                "INFORMATION SYSTEMS",
                "INTERNAL AUDIT",
                "INVESTIGATION",
                "IRD VAUNIYA",
                "KANDY HOLIDAY HOME",
                "KATARAGAMA HOLIDAY",
                "KKS",
                "LEGAL",
                "LBD ANURADHAPURA",
                "LBD BADULLA",
                "LBD BATTICALOA",
                "LBD GALLE",
                "LBD HAPUTALE",
                "LBD KOTAGALA",
                "LBD KURUNEGELA",
                "LBD MATARA",
                "LBD PERADENIYA",
                "LBD SARASAVI UYANA",
                "MAIN LABORATORY",
                "MEDICAL CENTER",
                "MUTHURAJWELA TERM",
                "NUWARAELIYA HOLIDAY",
                "OIL FACILITIES - OFF",
                "PERSONNEL",
                "PREMISES & ENGG. SER",
                "PROCUREMENT",
                "SECRETARIAT",
                "SECURITY",
                "STORES",
                "TRAINING",
              ].map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                {errors.department}
              </p>
            )}
          </div>

          {/* Contact No */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact No. <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md ${
                errors.contactNo
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {errors.contactNo && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                {errors.contactNo}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender <span className="text-red-500">*</span>
            </label>

            <div className="mt-2 flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                />
                <span className="ml-2 text-gray-700">Male</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                />
                <span className="ml-2 text-gray-700">Female</span>
              </label>
            </div>

            {errors.gender && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                {errors.gender}
              </p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md ${
                errors.dateOfBirth
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {errors.dateOfBirth && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                {errors.dateOfBirth}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md shadow-md mt-2"
          >
            Register Patient
          </button>
        </form>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 p-3 rounded-md text-center ${
              message.includes("successfully")
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterPatient;
