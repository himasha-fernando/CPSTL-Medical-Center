import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  ChartBarIcon,
  HeartIcon,
  EyeIcon,
  CalendarDaysIcon,
  XMarkIcon,
  UserIcon,
  ArrowsUpDownIcon,
  ScaleIcon,
  ChartPieIcon,
  RectangleGroupIcon,
  BeakerIcon,
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  FireIcon,
  PencilSquareIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Wine } from "lucide-react";
import AppSidebar from "../Components/AppSidebar";
import AppHeader from "../Components/UserAppHeader";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Enhanced Card for Metric Display
const MetricCard = ({
  icon: Icon,
  label,
  value,
  colorClass = "text-red-500",
}) => (
  <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-4 transition transform hover:scale-[1.02] duration-300 ease-in-out">
    <div
      className={`p-3 rounded-lg bg-gray-50 flex items-center justify-center`}
    >
      <Icon className={`w-6 h-6 ${colorClass}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-800 break-words max-w-full">
        {value}
      </p>
    </div>
  </div>
);

// Enhanced Notes/Summary Card
const NotesCard = ({
  icon: Icon,
  title,
  content,
  colorClass = "text-green-600",
}) => (
  <div
    className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-opacity-70"
    style={{
      borderColor: `var(--color-${colorClass.split("-")[1]}-400, #34d399)`,
    }}
  >
    <div className="flex items-center mb-3">
      <Icon className={`w-6 h-6 mr-2 ${colorClass}`} />
      <h4 className="text-lg font-bold text-gray-800">{title}</h4>
    </div>
    <p className="text-gray-600 whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
      {content || "No detailed information available."}
    </p>
  </div>
);

const MyReports = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("detailed");
  const [comparisonData, setComparisonData] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen((s) => !s);
  const closeSidebar = () => setIsSidebarOpen(false);

  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("userData"))?.id;
  const userRole = JSON.parse(localStorage.getItem("userData"))?.role;

  useEffect(() => {
    if (!userId) return;
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/patientmedicalrecords/${userId}/records`
        );
        const allRecords = res.data?.records ?? res.data ?? [];
        allRecords.sort(
          (a, b) => new Date(b.visitDate) - new Date(a.visitDate)
        );
        setRecords(allRecords);
        setFilteredRecords(allRecords);
      } catch (err) {
        console.error("Error fetching records:", err);
        setRecords([]);
        setFilteredRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [userId]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredRecords(records);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredRecords(
        records.filter(
          (rec) =>
            rec.currentProblems?.toLowerCase().includes(query) ||
            rec.treatmentPlan?.toLowerCase().includes(query) ||
            rec.notes?.toLowerCase().includes(query) ||
            new Date(rec.visitDate).toLocaleDateString().includes(query)
        )
      );
    }
  }, [searchQuery, records]);

  useEffect(() => {
    if (!selectedRecord || viewMode !== "comparison") return;
    const latestRecords = records
      .sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate))
      .slice(-10);
    const chartData = latestRecords.map((rec) => ({
      date: new Date(rec.visitDate).toLocaleDateString(),
      BMI: rec.bmi ?? null,
      FBS: rec.fbs ?? null,
      RBS: rec.rbs ?? null,
      SystolicBP: rec.systolicBP ?? null,
      DiastolicBP: rec.diastolicBP ?? null,
    }));
    setComparisonData(chartData);
  }, [selectedRecord, viewMode, records]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <AppSidebar
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={closeSidebar}
        currentPage="UserDashboard"
        userRole={userRole}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-l-4 border-red-500 pl-3">
            Your Medical Reports 🩺
          </h2>
          <div className="mb-8 max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="🔍 Search reports by date, notes, or problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 rounded-full border border-gray-300 shadow-md focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition duration-150 text-gray-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-20 text-xl text-gray-500 font-medium">
                <svg
                  className="animate-spin h-8 w-8 text-red-500 mx-auto mb-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading your medical history...
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="col-span-full text-center py-20 text-xl text-gray-500 font-medium bg-white rounded-xl shadow-lg">
                <p className="mb-2">😔 No medical records found.</p>
                <p className="text-base">
                  Try a different search or contact your provider.
                </p>
              </div>
            ) : (
              filteredRecords.map((item, i) => (
                <div
                  key={item.id ?? i}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 ease-in-out p-6 flex flex-col justify-between border-t-4 border-red-500/80 cursor-pointer"
                  onClick={() => {
                    setSelectedRecord(item);
                    setViewMode("detailed");
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <ChartBarIcon className="w-8 h-8 text-red-600" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            Visit: {formatDate(item.visitDate)}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            {formatTime(item.visitDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic mb-4 line-clamp-2">
                      {item.currentProblems ||
                        item.treatmentPlan ||
                        item.notes ||
                        "No quick summary available."}
                    </p>
                  </div>

                  <button className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition duration-150 transform hover:scale-[1.01]">
                    <EyeIcon className="w-5 h-5" /> View Details
                  </button>
                </div>
              ))
            )}
          </div>
        </main>

        {selectedRecord && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col relative transition-transform duration-300 transform scale-100">
              <div className="p-6 md:p-8 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
                    <HeartIcon className="w-7 h-7 text-red-500" /> Medical
                    Report - {formatDate(selectedRecord.visitDate)}
                  </h3>

                  <div className="flex items-center space-x-3 bg-gray-100 p-1 rounded-full shadow-inner">
                    <button
                      className={`px-6 py-2 rounded-full text-sm font-semibold transition duration-200 ${
                        viewMode === "detailed"
                          ? "bg-red-500 text-white shadow-md"
                          : "text-gray-600 hover:text-red-500"
                      }`}
                      onClick={() => setViewMode("detailed")}
                    >
                      Detailed View
                    </button>
                    <button
                      className={`px-6 py-2 rounded-full text-sm font-semibold transition duration-200 ${
                        viewMode === "comparison"
                          ? "bg-red-500 text-white shadow-md"
                          : "text-gray-600 hover:text-red-500"
                      }`}
                      onClick={() => setViewMode("comparison")}
                    >
                      Comparison Chart
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="text-gray-400 hover:text-gray-700 p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition"
                    aria-label="Close modal"
                  >
                    <XMarkIcon className="w-7 h-7" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">
                {viewMode === "detailed" ? (
                  <div className="space-y-10">
                    {/* Key Health Metrics */}
                    <div>
                      <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-6 border-l-4 border-red-500 pl-4">
                        Key Health Metrics
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <MetricCard
                          icon={UserIcon}
                          label="Age"
                          value={selectedRecord.age ?? "-"}
                          colorClass="text-red-500"
                        />
                        <MetricCard
                          icon={ArrowsUpDownIcon}
                          label="Height"
                          value={`${selectedRecord.height ?? "-"} cm`}
                          colorClass="text-blue-500"
                        />
                        <MetricCard
                          icon={ScaleIcon}
                          label="Weight"
                          value={`${selectedRecord.weight ?? "-"} kg`}
                          colorClass="text-amber-500"
                        />
                        <MetricCard
                          icon={ChartPieIcon}
                          label="BMI"
                          value={selectedRecord.bmi ?? "-"}
                          colorClass="text-purple-500"
                        />
                        <MetricCard
                          icon={RectangleGroupIcon}
                          label="Waist"
                          value={selectedRecord.waist ?? "-"}
                          colorClass="text-green-600"
                        />
                      </div>
                    </div>

                    {/* Vitals & Blood Sugar */}
                    <div>
                      <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-6 border-l-4 border-red-500 pl-4">
                        Vitals & Blood Sugar
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <MetricCard
                          icon={BeakerIcon}
                          label="FBS (Fasting)"
                          value={selectedRecord.fbs ?? "-"}
                          colorClass="text-indigo-500"
                        />
                        <MetricCard
                          icon={BeakerIcon}
                          label="RBS (Random)"
                          value={selectedRecord.rbs ?? "-"}
                          colorClass="text-pink-500"
                        />
                        <MetricCard
                          icon={HeartIcon}
                          label="Blood Pressure (Systolic/Diastolic)"
                          value={
                            selectedRecord.systolicBP &&
                            selectedRecord.diastolicBP
                              ? `${selectedRecord.systolicBP}/${selectedRecord.diastolicBP}`
                              : "-"
                          }
                          colorClass="text-red-600"
                        />
                      </div>
                    </div>

                    {/* Vision & Female Health */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-gray-700 border-b pb-2">
                          Vision Check
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <MetricCard
                            icon={EyeIcon}
                            label="Vision (Left)"
                            value={selectedRecord.visionLeft ?? "-"}
                            colorClass="text-blue-400"
                          />
                          <MetricCard
                            icon={EyeIcon}
                            label="Vision (Right)"
                            value={selectedRecord.visionRight ?? "-"}
                            colorClass="text-blue-400"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-gray-700 border-b pb-2">
                          Female Health Screenings
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <MetricCard
                            icon={ShieldCheckIcon}
                            label="Breast Exam"
                            value={selectedRecord.breastExamination ?? "-"}
                            colorClass="text-rose-500"
                          />
                          <MetricCard
                            icon={ClipboardDocumentCheckIcon}
                            label="Pap Smear"
                            value={selectedRecord.papSmear ?? "-"}
                            colorClass="text-violet-600"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Lifestyle */}
                    <div>
                      <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-6 border-l-4 border-red-500 pl-4">
                        Lifestyle & Habits
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <NotesCard
                          icon={Wine}
                          title="Alcohol Consumption"
                          content={
                            selectedRecord.alcoholConsumption === "Yes" &&
                            selectedRecord.alcoholSummary
                              ? `${selectedRecord.alcoholConsumption}: ${selectedRecord.alcoholSummary}`
                              : selectedRecord.alcoholConsumption ??
                                "No details."
                          }
                          colorClass="text-orange-600"
                        />
                        <NotesCard
                          icon={FireIcon}
                          title="Smoking Habits"
                          content={
                            selectedRecord.smokingHabits === "Yes" &&
                            selectedRecord.smokingSummary
                              ? `${selectedRecord.smokingHabits}: ${selectedRecord.smokingSummary}`
                              : selectedRecord.smokingHabits ?? "No details."
                          }
                          colorClass="text-gray-700"
                        />
                      </div>
                    </div>

                    {/* Notes & Treatment */}
                    <div>
                      <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-6 border-l-4 border-red-500 pl-4">
                        Notes & Treatment Plan
                      </h3>
                      <div className="grid grid-cols-1 gap-6">
                        <NotesCard
                          icon={PencilSquareIcon}
                          title="Current Problems & Findings"
                          content={selectedRecord.currentProblems ?? "-"}
                          colorClass="text-red-500"
                        />
                        <NotesCard
                          icon={ChatBubbleLeftRightIcon}
                          title="Treatment Plan / Doctor's Notes"
                          content={
                            selectedRecord.treatmentPlan ??
                            selectedRecord.notes ??
                            "-"
                          }
                          colorClass="text-green-700"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-[60vh] p-4 bg-white rounded-xl shadow-lg">
                    <h4 className="text-xl font-bold text-gray-700 mb-4">
                      Trend Comparison (Last {comparisonData.length} Visits)
                    </h4>
                    <ResponsiveContainer width="100%" height="90%">
                      <LineChart
                        data={comparisonData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          stroke="#4b5563"
                          padding={{ left: 30, right: 30 }}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          stroke="#4b5563"
                          tick={{ fontSize: 12 }}
                          domain={["auto", "auto"]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "10px",
                          }}
                        />
                        <Legend wrapperStyle={{ paddingTop: "10px" }} />
                        <Line
                          type="monotone"
                          dataKey="BMI"
                          stroke="#f87171"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="FBS"
                          stroke="#60a5fa"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="RBS"
                          stroke="#34d399"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="SystolicBP"
                          stroke="#fbbf24"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="DiastolicBP"
                          stroke="#a78bfa"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
