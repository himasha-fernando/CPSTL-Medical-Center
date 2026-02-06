import React, { useState,useEffect } from "react";
import api from "../utils/api";
import {
  ExclamationCircleIcon,
  UserCircleIcon,
  EyeIcon, EyeSlashIcon,
} from "@heroicons/react/24/outline";

function RegisterPatient({ onClose,isOpen }) {
  const [formData, setFormData] = useState({
    registrationNo: "",
    name: "",
    epfNo: "",
    department: "",
    contactNo: "",
    gender: "",
    dateOfBirth: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (name === "epfNo") {
    checkEpfNo(value); 
  }
  };

  // Password validation helper
const validatePassword = (password) => {
  const hasLetters = /[a-zA-Z]/.test(password);
  const numberCount = (password.match(/\d/g) || []).length;

  if (!hasLetters || numberCount < 2) {
    return "Password must contain letters and at least 2 numbers";
  }

  return "";
};

 useEffect(() => {
    if (!isOpen) return; 

    const fetchNextRegNo = async () => {
      try {
        const res = await api.get(
          "/patients/next-registration"
        );
        setFormData(prev => ({ ...prev, registrationNo: res.data.registrationNo }));
      } catch (err) {
        console.error("Failed to fetch next registration number", err);
      }
    };
    fetchNextRegNo();
  }, [isOpen]);





  const validate = () => {
    const newErrors = {};
    if (!formData.registrationNo)
      newErrors.registrationNo = "Registration No. is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.epfNo) newErrors.epfNo = "EPF No. is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.contactNo) newErrors.contactNo = "Contact No. is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.password) {
    newErrors.password = "Password is required";
  } else {
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
  }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await api.post("/patients/add", formData);
      setMessage("Patient registered successfully!");
      setFormData({
        registrationNo: "",
        name: "",
        epfNo: "",
        department: "",
        contactNo: "",
        gender: "",
        dateOfBirth: "",
        password: "",
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
  

  // Check if EPF No already exists
const checkEpfNo = async (epfNo) => {
  if (!epfNo) return; // Skip if empty

  try {
    const res = await api.get(`/patients/check-epf/${epfNo}`);
    if (res.data.exists) {
      setErrors((prev) => ({ ...prev, epfNo: "EPF No already exists" }));
    } else {
      setErrors((prev) => ({ ...prev, epfNo: "" }));
    }
  } catch (err) {
    console.error("Error checking EPF:", err);
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
              readOnly
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

          {/* Password */}
<div>
  <label className="block text-sm font-medium text-gray-700">
    Password <span className="text-red-500">*</span>
  </label>

  <div className="relative mt-1">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
      className={`block w-full p-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
        errors.password
          ? "border-red-500 bg-red-50"
          : "border-gray-300"
      }`}
    />

    {/* Show / Hide icon */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
    >
      {showPassword ? (
        <EyeSlashIcon className="w-5 h-5" />
      ) : (
        <EyeIcon className="w-5 h-5" />
      )}
    </button>
  </div>

  {/* Helper text */}
  <p className="text-xs text-gray-500 mt-1">
    Password must contain letters and at least <b>2 numbers</b>.
  </p>

  {/* Error message */}
  {errors.password && (
    <p className="text-xs text-red-500 mt-1 flex items-center">
      <ExclamationCircleIcon className="w-4 h-4 mr-1" />
      {errors.password}
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
