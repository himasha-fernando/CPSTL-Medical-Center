import React, { useEffect, useState } from "react";
import api from "../utils/api";
import AppSidebar from "../Components/AppSidebar";
import AppHeader from "../Components/AppHeader";
import AppFooter from "../Components/AppFooter";

const departments = [
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
];

const PatientCount = () => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
const [selectedDepartment, setSelectedDepartment] = useState(null);
const [absentPatients, setAbsentPatients] = useState([]);
const [modalLoading, setModalLoading] = useState(false);


  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await api.get(
          "/patients/absentCount"
        );
        const results = {};

        res.data.forEach((item) => {
          results[item.department] = item.absentCount;
        });

        setCounts(results);
      } catch (err) {
        console.error("Error fetching counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // Filter departments based on search term
  const filteredDepartments = departments.filter((dept) =>
    dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle selecting a department from the dropdown
  const handleSelect = (dept) => {
    setSearchTerm(dept);
    setShowDropdown(false);
  };


const openAbsentModal = async (department) => {
  setSelectedDepartment(department);
  setShowModal(true);
  setModalLoading(true);

  try {
    const res = await api.get(
      `/patients/absentPatients/${encodeURIComponent(department)}`
    );

    const patients = Array.isArray(res.data)
      ? res.data
      : res.data.patients || res.data.data || [];

    setAbsentPatients(patients);
  } catch (err) {
    console.error(err);
    alert("Failed to load absent patient details");
    setAbsentPatients([]);
  } finally {
    setModalLoading(false);
  }
};
 
  const downloadExcel = async (department) => {
  try {
    const response = await api.get(
      `/patients/absentPatients/excel/${encodeURIComponent(department)}`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Absent_${department}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error(err);
    alert("Failed to download Excel");
  }
};
  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <AppHeader />

        <div className="p-8 flex-1 bg-gray-50">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Absent Patients by Department
          </h1>

          {/* Search Field */}
          <div className="mb-6 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search department..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            /> 

            {showDropdown && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow">
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept) => (
                    <li
                      key={dept}
                      onClick={() => handleSelect(dept)}
                      className="p-2 cursor-pointer hover:bg-red-100"
                    >
                      {dept}   
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">No departments found</li>
                )}
              </ul>
            )}
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {(searchTerm ? filteredDepartments : departments).map((dept) => (
                <div
  key={dept}
  onClick={() => openAbsentModal(dept)}
  className="p-6 bg-white shadow rounded-lg text-center border border-gray-200 cursor-pointer hover:bg-red-50 transition"
>
                  <h2 className="text-xl font-semibold mb-2 text-gray-700">
                    {dept}
                  </h2>
                  <p className="text-4xl font-bold text-red-600">
                    {counts[dept] ?? 0}
                  </p>
                  <p className="text-gray-500 mt-1">Absent Patients</p>
                
                </div>
              ))}
            </div>
          )}
        </div>
        {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="relative w-full max-w-4xl mx-4 bg-gray-200 rounded-2xl shadow-2xl overflow-hidden">

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-700 to-red-500 text-white">
        <div>
          <h2 className="text-xl md:text-3xl font-semibold tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }} >
            Absent Patients
          </h2>
          <p className="text-sm opacity-90 mt-0.5 font-semibold">
            {selectedDepartment} FUNCTION
          </p>
        </div>

        <button
          onClick={() => setShowModal(false)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 transition"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {modalLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Loading absent patients...</p>
          </div>
        ) : absentPatients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-lg font-medium text-gray-600">
              {counts[selectedDepartment] > 0
                ? "Data exists but could not be loaded"
                : "No absent patients found"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Please contact the administrator if this persists
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[420px] rounded-xl border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">EPF No</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Contact No</th>
                </tr>
              </thead>
              <tbody>
                {absentPatients.map((p, index) => (
                  <tr
                    key={p._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-red-50 transition`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {p.epfNo}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {p.contactNo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-gray-200 border-t gap-3 md:gap-0">
  <span className="text-sm text-gray-700 mb-2 md:mb-0">
    Total Absent: {absentPatients.length}
  </span>

  <div className="flex gap-3">
     <button
      onClick={() => downloadExcel(selectedDepartment)}
      className="relative overflow-hidden px-6 py-2.5 rounded-2xl font-semibold text-sm text-red-600 
             bg-white border-2 border-red-500 shadow-md hover:shadow-lg 
             hover:bg-red-700 hover:text-white hover:scale-105 active:scale-95 
             transition-all duration-300 ease-in-out flex items-center group"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0 0l-4-4m4 4l4-4M12 4v8" />
      </svg>
      Download Excel
    </button>

    <button
      onClick={() => setShowModal(false)}
      className="relative overflow-hidden px-6 py-2.5 rounded-2xl font-semibold text-sm text-red-600 
             bg-red-200 border-2 border-red-500 shadow-md hover:shadow-lg 
             hover:bg-red-700 hover:text-white hover:scale-105 active:scale-95 
             transition-all duration-300 ease-in-out flex items-center group"
    >
      Close
    </button>
  </div>
  
</div>
    </div>
  </div>
)}


        <AppFooter />
      </div>
    </div>
  );
};

export default PatientCount;
