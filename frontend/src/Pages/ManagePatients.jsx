import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
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
  ChartBarIcon,
  CalendarDaysIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";

import AppSidebar from "../Components/AppSidebar";
import AppHeader from "../Components/AppHeader";
import AppFooter from "../Components/AppFooter";
import ViewPatientModal from "../Components/ViewPatientModal";
import EditPatientModal from "../Components/EditPatientModal";
import PatientComparisonModal from "../Components/PatientComparisonModal";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inactivate":
        return "bg-red-100 text-red-800 border-red-200";
      case "In treatment":
        return "bg-blue-100 text-blue-800 border-blue-200";
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

function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab] = useState("list");

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const patientsPerPage = 10;
  const location = useLocation();
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("role") === "admin";
 

  useEffect(() => {
    if (location.state?.message) {
      setPopup({
        message: location.state.message,
        type: location.state.type || "info",
      });
      //Auto-hide popup after 3 seconds
      const timer = setTimeout(() => setPopup(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Determine patient status
  const determinePatientStatus = (patient) => {
    if (patient.currentProblems && patient.currentProblems.length > 50) {
      return "Inactivate";
    } else if (patient.treatmentPlan && patient.treatmentPlan.length > 0) {
      return "In treatment";
    }
    return "Active";
  };

  // Load patients from localStorage
useEffect(() => {
  const fetchPatients = async () => {
    try {
      const [patientsRes, recordsRes] = await Promise.all([
        api.get("/patients"),
        api.get("/patientmedicalrecords/records/all-dates"),
      ]);

      
      const visitDateMap = {};
      recordsRes.data.forEach((r) => {
        if (!visitDateMap[r.patient_id]) {
          visitDateMap[r.patient_id] = [];
        }
        visitDateMap[r.patient_id].push(r.visitDate);
      });

      const patientsWithVisits = patientsRes.data.map((p) => ({
        ...p,
        status: p.manualStatus || determinePatientStatus(p),
        visitDates: visitDateMap[p.id] || [],
      }));

      setPatients(patientsWithVisits);
      setFilteredPatients(patientsWithVisits);
    } catch (err) {
      console.error("Error loading patients:", err);
    }
  };

  fetchPatients();
}, []);


useEffect(() => {
  if (location.state?.filter === "todayCheckouts") {
    const today = new Date().toISOString().split("T")[0];
    setSearchTerm(today);
  }
}, [location.state]);


  // Calculate age
  const calculateAge = (dob) => {
    if (!dob) return "—";
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return "—";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Search and filter
useEffect(() => {
  let filtered = patients;
  const term = searchTerm.trim().toLowerCase();

  // Detect date (YYYY-MM-DD)
  const isDateSearch = /^\d{4}-\d{2}-\d{2}$/.test(term);

  filtered = filtered.filter((patient) => {
    // TEXT MATCH
    const textMatch =
      patient.name?.toLowerCase().includes(term) ||
      patient.registrationNo?.toLowerCase().includes(term) ||
      patient.epfNo?.toLowerCase().includes(term) ||
      patient.contactNo?.includes(term);

    // DATE MATCH
    const dateMatch =
      isDateSearch &&
      Array.isArray(patient.visitDates) &&
      patient.visitDates.includes(term);

    return isDateSearch ? dateMatch : textMatch;
  });

  // Status filter
  if (filterStatus !== "all") {
    filtered = filtered.filter((p) => p.status === filterStatus);
  }

  setFilteredPatients(filtered);
  setCurrentPage(1);
}, [searchTerm, filterStatus, patients]);




  // Pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Actions
  const handleView = async (patient) => {
    const patientId = patient.patient_id ?? patient.id;
    console.log("Fetching patientId:", patientId);

    try {
      // Fetch both patient info and latest medical record in parallel
      const [patientResp, recordResp] = await Promise.allSettled([
        api.get(`/patients/${patientId}`),
        api.get(
          `/patientmedicalrecords/${patientId}/latest`
        ),
      ]);

      // Extract basic patient info
      let patientData = null;
      if (patientResp.status === "fulfilled") {
        const p = patientResp.value.data;
        patientData = p.patient ?? p.data ?? p;
      } else {
        console.error(
          "Failed to fetch patient basic info:",
          patientResp.reason
        );
      }

      // Extract latest medical record
      let latestRecord = null;
      if (recordResp.status === "fulfilled") {
        const r = recordResp.value.data;
        if (r && r.success && r.latestRecord) latestRecord = r.latestRecord;
        else if (r && r.latestRecord) latestRecord = r.latestRecord;
        else if (r && (r.record || r.data)) latestRecord = r.record ?? r.data;
      } else {
        console.warn(
          "No medical record or failed to fetch:",
          recordResp.reason
        );
      }

      //Fallback if patient info could not be fetched
      if (!patientData) {
        console.warn(
          "Using fallback patient object passed from parent component."
        );
        setSelectedPatient(patient);
        setIsViewModalOpen(true);
        return;
      }

      //Merge patient info + latest medical record
      const fullPatient = { ...patientData, ...(latestRecord || {}) };

      //open the modal and show full details
      setSelectedPatient(fullPatient);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error("Unexpected error in handleView:", err);

      setSelectedPatient(patient);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = async (patient) => {
    const patientId = patient.patient_id ?? patient.id;
    console.log("Redirecting to Add New Patient page for:", patientId);

    try {
      // Fetch latest medical record
      const res = await api.get(
        `/patientmedicalrecords/${patientId}/latest`
      );

      let latestRecord = res.data?.latestRecord || null;

      //  calculate using DOB
      if (latestRecord && !latestRecord.age) {
        const calculatedAge = calculateAge(patient.dateOfBirth || patient.dob);

        latestRecord = {
          ...latestRecord,
          age: calculatedAge,
        };
      }

      console.log("Latest record after age processing:", latestRecord);

      // Go to AddNewPatient page with record
      navigate("/AddNewPatient", {
        state: {
          mode: "appendRecord",
          patient,
          latestRecord,
        },
      });
    } catch (err) {
      console.error("Error fetching patient details:", err);

      //  calculate age using DOB
      const calculatedAge = calculateAge(patient.dateOfBirth || patient.dob);

      navigate("/AddNewPatient", {
        state: {
          mode: "appendRecord",
          patient,
          latestRecord: {
            age: calculatedAge,
          },
        },
      });
    }
  };

  const handleCompareMetrics = (patient) => {
    setSelectedPatient(patient);
    setIsComparisonModalOpen(true);
  };

  const handleSavePatient = async (editedPatient) => {
    try {
      const formattedPatient = {
        ...editedPatient,
        dateOfBirth: editedPatient.dateOfBirth
          ? new Date(editedPatient.dateOfBirth).toISOString().split("T")[0]
          : null,
        patientHistory:
          Array.isArray(editedPatient.patientHistory) &&
          editedPatient.patientHistory.length > 0
            ? editedPatient.patientHistory
            : null,
        familyHistoryFather:
          Array.isArray(editedPatient.familyHistoryFather) &&
          editedPatient.familyHistoryFather.length > 0
            ? editedPatient.familyHistoryFather
            : null,
        familyHistoryMother:
          Array.isArray(editedPatient.familyHistoryMother) &&
          editedPatient.familyHistoryMother.length > 0
            ? editedPatient.familyHistoryMother
            : null,
        familyHistorySiblings:
          Array.isArray(editedPatient.familyHistorySiblings) &&
          editedPatient.familyHistorySiblings.length > 0
            ? editedPatient.familyHistorySiblings
            : null,
      };

      return formattedPatient;
    } catch (err) {
      console.error("Error preparing patient data:", err);
    }
  };

  const handleChangePassword = async (patient) => {
  const newPassword = prompt(
    `Enter new password for ${patient.name} (EPF: ${patient.epfNo})`
  );

  if (!newPassword) return;

  try {
    const res = await api.put("/auth/change-password", {
      userType: "patient",
      identifier: patient.epfNo,
      newPassword,
    });

    setPopup({
      message: res.data.message || "Password changed successfully",
      type: "success",
    });

    setTimeout(() => setPopup(null), 3000);
  } catch (err) {
    console.error("Password change failed:", err);

    setPopup({
      message:
        err.response?.data?.message ||
        "Failed to change password",
      type: "error",
    });

    setTimeout(() => setPopup(null), 3000);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;

    try {
      const res = await api.delete(
        `/patients/delete/${id}`
      );
      console.log(res.data.message);

      setPatients((prev) => prev.filter((patient) => patient.id !== id));

      alert("Patient deleted successfully!");
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Failed to delete patient. Please try again.");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Row-by-row status toggle
  const handleToggleRowStatus = (patientId) => {
    const updated = patients.map((p) => {
      if (p.id !== patientId) return p;

      const current = p.manualStatus || determinePatientStatus(p);
      let nextStatus;
      if (current === "Inactivate") {
        nextStatus =
          p.treatmentPlan && p.treatmentPlan.length > 0
            ? "In treatment"
            : "Active";
      } else {
        nextStatus = "Inactivate";
      }
      return {
        ...p,
        manualStatus: nextStatus,
        status: nextStatus,
        lastUpdated: new Date().toISOString(),
      };
    });

    setPatients(updated);
    localStorage.setItem("patients", JSON.stringify(updated));
  };

  // Small toggle UI
  const RowToggle = ({ on, onClick, title }) => (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      title={title}
      className={`relative inline-flex h-5 w-10 items-center rounded-full border transition-colors ${
        on ? "bg-green-500 border-green-600" : "bg-red-500 border-red-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );

  // Get patients with health metrics for comparison
  const getPatientsWithMetrics = () => {
    return patients.filter(
      (patient) =>
        patient.height ||
        patient.weight ||
        patient.bmi ||
        patient.waist ||
        patient.bp ||
        patient.rbs ||
        patient.fbs ||
        patient.visionLeft ||
        patient.visionRight
    );
  };

  const renderListView = () => (
    <>
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, registration no, EPF no, or contact or visit date (YYYY-MM-DD)..."
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Inactivate">Inactivate</option>
            <option value="In treatment">In-treatment</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {currentPatients.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EPF No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age/Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {currentPatients
                .slice()
                .sort((a, b) => a.id - b.id) //  ascending by ID
                .map((patient) => {
                  const isOn = patient.status !== "Inactivate";
                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Registration No */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {patient.epfNo}
                      </td>

                      {/* Patient Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Reg: {patient.registrationNo}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <PhoneIcon className="w-4 h-4 mr-1 text-gray-400" />
                          {patient.contactNo}
                        </div>
                      </td>

                      {/* Age & Gender */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.dateOfBirth
                          ? `${calculateAge(patient.dateOfBirth)} yrs`
                          : "—"}{" "}
                        / {patient.gender || "—"}
                      </td>

                      {/* Status + Toggle */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <StatusBadge status={patient.status} />
                          <RowToggle
                            on={isOn}
                            onClick={() => handleToggleRowStatus(patient.id)}
                            title={
                              isOn
                                ? "Toggle OFF (Inactivate)"
                                : "Toggle ON (Active/In treatment)"
                            }
                          />
                        </div>
                      </td>

                      {/* Last Updated */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(
                          patient.lastUpdated || Date.now()
                        ).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleView(patient)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(patient)}
                            className="p-1 text-yellow-600 hover:bg-yellow-100 rounded transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>

                          {isAdmin && (
  <button
    onClick={() => handleChangePassword(patient)}
    className="p-1 text-purple-600 hover:bg-purple-100 rounded transition-colors"
    title="Change Password"
  >
    <KeyIcon className="w-5 h-5" />
  </button>
)}



                          <button
                            onClick={() => handleDelete(patient.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">No patients found</p>
            <p className="mt-1 text-xs text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Add a new patient to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstPatient + 1} to{" "}
              {Math.min(indexOfLastPatient, filteredPatients.length)} of{" "}
              {filteredPatients.length} patients
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
    </>
  );

  const renderComparisonView = () => {
    const patientsWithMetrics = getPatientsWithMetrics();

    return (
      <div className="space-y-6">
        {/* Comparison Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center">
              <ChartBarIcon className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {patientsWithMetrics.length}
                </p>
                <p className="text-sm text-gray-600">
                  Patients with Health Data
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center">
              <CalendarDaysIcon className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {
                    patientsWithMetrics.filter((p) => p.monthlyData?.length > 0)
                      .length
                  }
                </p>
                <p className="text-sm text-gray-600">With Monthly Tracking</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center">
              <CalendarDaysIcon className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {
                    patientsWithMetrics.filter((p) => p.yearlyData?.length > 0)
                      .length
                  }
                </p>
                <p className="text-sm text-gray-600">With Yearly Tracking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patientsWithMetrics.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {patient.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Reg: {patient.registrationNo}
                    </p>
                  </div>
                  <StatusBadge status={patient.status} />
                </div>

                {/* Quick Health Metrics */}
                <div className="space-y-2 mb-4">
                  {patient.height && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Height:</span>
                      <span className="font-medium">{patient.height} cm</span>
                    </div>
                  )}
                  {patient.weight && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">{patient.weight} kg</span>
                    </div>
                  )}
                  {patient.bmi && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">BMI:</span>
                      <span className="font-medium">{patient.bmi}</span>
                    </div>
                  )}
                  {patient.bp && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">BP:</span>
                      <span className="font-medium">{patient.bp}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {patientsWithMetrics.length === 0 && (
          <div className="text-center py-12">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              No patients with health metrics found
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Health metrics will appear here once patients have recorded data
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <AppSidebar
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={closeSidebar}
        currentPage="Manage Patients"
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <UserCircleIcon className="w-8 h-8 mr-3 text-red-500" />
                  Manage Patients
                </h1>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Total Patients:</span>
                  <span className="text-lg font-semibold text-red-600">
                    {patients.length}
                  </span>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4"></div>

              {/* Tab Content */}
              {activeTab === "list" ? renderListView() : renderComparisonView()}
            </div>
          </div>
          {/*Popup*/}
          {popup && (
            <div
              className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 ${
                popup.type === "success"
                  ? "bg-green-500 text-white"
                  : popup.type === "error"
                  ? "bg-red-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {popup.message}
            </div>
          )}
        </div>

        <AppFooter />
      </main>

      {/* Modals */}
      <ViewPatientModal
        patient={selectedPatient}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={() => {
          setIsViewModalOpen(false);
          setIsEditModalOpen(true);
        }}
      />

      {/* Edit Modal */}
      <EditPatientModal
        patient={selectedPatient}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSavePatient}
      />
    </div>
  );
}

export default ManagePatients;
