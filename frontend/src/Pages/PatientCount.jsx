import React, { useEffect, useState } from "react";
import axios from "axios";
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

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/patients/absentCount"
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
                  className="p-6 bg-white shadow rounded-lg text-center border border-gray-200"
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

        <AppFooter />
      </div>
    </div>
  );
};

export default PatientCount;
