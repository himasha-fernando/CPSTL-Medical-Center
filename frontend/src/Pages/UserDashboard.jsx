import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  CubeTransparentIcon,
} from "@heroicons/react/24/outline";
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
import { Wine } from "lucide-react";

import AppSidebar from "../Components/AppSidebar";
import AppHeader from "../Components/UserAppHeader";
import AppFooter from "../Components/AppFooter";

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

const StatCard = ({ icon: Icon, title, value, sub, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow min-h-[84px]">
    <div className="flex items-center">
      <div className="rounded-lg bg-red-50 text-red-600 p-2 mr-3">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="text-xl font-semibold text-gray-800">
          {loading ? "..." : value ?? "N/A"}
        </div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
    </div>
    {sub && <div className="mt-2 text-xs text-gray-500">{sub}</div>}
  </div>
);

/* Promo banner */
const PromoBanner = ({ userName = "User" }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="relative w-full mb-4">
      <div className="relative overflow-hidden rounded-xl p-6 md:p-7 lg:p-8 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 flex items-center">
          <div className="flex-1">
            <div className="text-2xl md:text-3xl font-bold leading-tight">
              Welcome back, {userName}!
            </div>
            <div className="mt-2 text-sm text-white/90">
              Check your latest medical progress and appointments.
            </div>
            <div className="mt-2 flex items-center text-sm text-red-50">
              <CalendarDaysIcon className="w-4 h-4 mr-1 opacity-90" />
              {formattedDate} · {formattedTime}
            </div>
          </div>
          <div className="hidden md:block ml-6">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
              <img
                src="/MedRecords.png"
                alt="Medical"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Simple card listing recent records */
const UserRecordsCard = ({ records = [], onRecordOpen }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full h-[800px]">
      <div className="px-5 py-4 bg-red-500 text-white">
        <div className="text-base font-semibold">My Latest Records</div>
        <div className="text-xs text-red-100">
          Quick access to recent medical visits
        </div>
      </div>

      <div className="px-5 py-3 border-b border-gray-100">
        <input
          type="text"
          placeholder="Search by date or notes"
          className="w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      <div className="divide-y divide-gray-100 overflow-y-auto h-[600px]">
        {records.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-10">
            No medical records found
          </div>
        ) : (
          records.map((item, i) => (
            <div
              key={item.id ?? i}
              className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-semibold text-xs">
                    <ChartBarIcon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {new Date(item.visitDate).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500 truncate w-40">
                    {item.currentProblems ||
                      item.treatmentPlan ||
                      item.notes ||
                      "No summary"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* VIEW Button styled like completed pill */}
                <button
                  onClick={() => onRecordOpen?.(item)}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition"
                >
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

//Main Component

function UserDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((s) => !s);
  const closeSidebar = () => setIsSidebarOpen(false);

  const navigate = useNavigate();

  // user data from localStorage
  const stored = localStorage.getItem("userData");
  let storedUser = null;
  try {
    storedUser = stored ? JSON.parse(stored) : null;
  } catch {
    storedUser = null;
  }
  const userId = storedUser?.id || localStorage.getItem("userId");
  const userName = storedUser?.name || storedUser?.username || "User";
  const userRole =
    storedUser?.role || localStorage.getItem("role") || "patient";

  // stats
  const [latestRecord, setLatestRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const [totalVisits, setTotalVisits] = useState(null);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewMode, setViewMode] = useState("detailed");
  const [comparisonData, setComparisonData] = useState([]);

  // derived display values for Option A (Latest BMI, Latest BP, Latest FBS)
  const latestBMI = latestRecord?.bmi ?? latestRecord?.BMI ?? null;
  const systolic = latestRecord?.systolicBP ?? latestRecord?.systolic ?? null;
  const diastolic =
    latestRecord?.diastolicBP ?? latestRecord?.diastolic ?? null;
  const latestBP =
    systolic || diastolic ? `${systolic ?? "?"}/${diastolic ?? "?"}` : null;
  const latestFBS =
    latestRecord?.fbs ?? latestRecord?.FBS ?? latestRecord?.rbs ?? null;
  const latestRBS = latestRecord?.rbs ?? latestRecord?.RBS ?? null;

  // fetch latest record
  useEffect(() => {
    if (!userId) {
      // If no user found, redirect to login
      navigate("/login");
      return;
    }

    const fetchLatest = async () => {
      setLoadingLatest(true);
      setError(null);
      try {
        // Attempt route that exists in your backend
        const url = `http://localhost:5000/patientmedicalrecords/${userId}/latest`;
        const res = await axios.get(url);
        // backend might return an array directly or { data: [...] } etc
        let rec =
          res.data?.latestRecord ??
          res.data ??
          (Array.isArray(res.data) ? res.data[0] : null);
        // If the result is an array with length, take first
        if (Array.isArray(rec) && rec.length > 0) rec = rec[0];
        setLatestRecord(rec || null);
      } catch (err) {
        console.error("Error fetching latest record:", err);
        setError(err);
        setLatestRecord(null);
      } finally {
        setLoadingLatest(false);
      }
    };

    fetchLatest();
  }, [userId, navigate]);

  // fetch recent records (limit latest 10)
  useEffect(() => {
    if (!userId) return;
    const fetchRecords = async () => {
      setLoadingRecords(true);
      try {
        const url = `http://localhost:5000/patientmedicalrecords/${userId}/records`;
        const res = await axios.get(url);

        let list =
          res.data?.records ??
          res.data ??
          (Array.isArray(res.data) ? res.data : []);
        // if server returned object with rows
        if (list && typeof list === "object" && !Array.isArray(list)) {
          // if it's object with numeric keys, try the first property
          const first = Object.values(list).find((v) => Array.isArray(v));
          if (Array.isArray(first)) list = first;
        }
        // keep only first 10
        if (Array.isArray(list)) setRecords(list.slice(0, 10));
        else setRecords([]);
      } catch (err) {
        console.error("Error fetching records:", err);
        setRecords([]);
      } finally {
        setLoadingRecords(false);
      }
    };

    fetchRecords();
  }, [userId]);

  useEffect(() => {
    if (!selectedRecord || viewMode !== "comparison") return;

    const latestRecords = [...records]
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

  // fetch total visits count via your count route
  useEffect(() => {
    if (!userId) return;
    const fetchCount = async () => {
      try {
        const url = `http://localhost:5000/patientmedicalrecords/count/${userId}`;
        const res = await axios.get(url);
        // backend route returns
        const count =
          res.data?.count ??
          (res.data && res.data[0] && res.data[0].count) ??
          null;
        setTotalVisits(count);
      } catch (err) {
        console.error("Error fetching total visits count:", err);
        setTotalVisits(null);
      }
    };
    fetchCount();
  }, [userId]);

  const handleRecordOpen = (record) => {
    setSelectedRecord(record); // open modal with this record
    setViewMode("detailed"); // default to detailed view
  };
  const getNextVisitDate = (latest) => {
    if (!latest?.visitDate) return "—";
    const date = new Date(latest.visitDate);
    date.setMonth(date.getMonth() + 6); // Add 6 months
    return date.toLocaleDateString();
  };

  // Calculate Average BMI from records
  const getAverageBMI = (records) => {
    if (!records || records.length === 0) return "—";

    const bmis = records
      .map((r) => r.bmi ?? r.BMI)
      .filter(Boolean)
      .map(Number); // convert strings to numbers

    if (bmis.length === 0) return "—";

    const avg = bmis.reduce((a, b) => a + b, 0) / bmis.length;
    return avg.toFixed(1);
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "short", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const MetricCard = ({ icon: IconComponent, label, value }) => (
    <div className="glass-card flex items-center gap-4 p-4 rounded-xl shadow-md">
      {IconComponent && (
        <div className="icon">
          <IconComponent className="w-6 h-6 text-gray-500" />
        </div>
      )}
      <div>
        <p className="card-label text-gray-500 text-sm">{label}</p>
        <p className="card-value text-lg font-semibold">{value ?? "-"}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <AppSidebar
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={closeSidebar}
        currentPage="UserDashboard"
        userRole={userRole}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            {/* LEFT (2/3) */}
            <div className="lg:col-span-2">
              <PromoBanner userName={userName} />

              {/* Stat Cards row- Latest BMI, Latest BP, Latest FBS */}
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  icon={ChartBarIcon}
                  title="Latest BMI"
                  value={loadingLatest ? null : latestBMI ?? "—"}
                  sub={
                    latestRecord?.visitDate
                      ? `Taken on ${new Date(
                          latestRecord.visitDate
                        ).toLocaleDateString()}`
                      : "No recent reading"
                  }
                  loading={loadingLatest}
                />
                <StatCard
                  icon={HeartIcon}
                  title="Latest Blood Pressure"
                  value={loadingLatest ? null : latestBP ?? "—"}
                  sub={
                    latestRecord?.visitDate
                      ? `Taken on ${new Date(
                          latestRecord.visitDate
                        ).toLocaleDateString()}`
                      : "No recent reading"
                  }
                  loading={loadingLatest}
                />
                <StatCard
                  icon={ChartBarIcon}
                  title="Latest Fasting Blood Sugar (FBS)"
                  value={loadingLatest ? null : latestFBS ?? "—"}
                  sub={
                    latestRecord?.visitDate
                      ? `Taken on ${new Date(
                          latestRecord.visitDate
                        ).toLocaleDateString()}`
                      : "No recent reading"
                  }
                  loading={loadingLatest}
                />
              </div>

              {/* Chart / Trend */}
              <div className="mt-1 grid grid-cols-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 h-49 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-semibold text-gray-800">
                        Medical Records Trend
                      </div>
                      <div className="text-xs text-gray-500">
                        Summary of recent measurements
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">Last 10 visits</div>
                  </div>

                  {/* 🔥 Scrollable inside area */}
                  <div className="mt-4 text-sm text-gray-600 flex-1 overflow-y-auto">
                    {loadingRecords ? (
                      <div>Loading recent records...</div>
                    ) : records.length === 0 ? (
                      <div>No records to display.</div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {records.map((r, idx) => (
                          <div
                            key={r.id ?? idx}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <div>
                              <div className="text-sm font-semibold">
                                {new Date(r.visitDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                BMI: {r.bmi ?? "-"} · BP:{" "}
                                {r.systolicBP && r.diastolicBP
                                  ? `${r.systolicBP}/${r.diastolicBP}`
                                  : "-"}{" "}
                                · FBS: {r.fbs ?? "-"}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400">
                              {r.status ?? "Completed"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT (1/3) */}
            <div className="flex flex-col gap-6 p-4 -mt-5">
              {/* Summary / Stats */}

              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  Summary
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Total Visits */}
                  <div className="flex items-center gap-4 bg-indigo-50 rounded-xl p-4 shadow hover:shadow-md transition">
                    <CalendarDaysIcon className="w-8 h-8 text-indigo-500" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        Total Visits
                      </span>
                      <span className="text-lg font-bold text-gray-800">
                        {totalVisits ?? "—"}
                      </span>
                    </div>
                  </div>

                  {/* Average BMI */}
                  <div className="flex items-center gap-4 bg-yellow-50 rounded-xl p-4 shadow hover:shadow-md transition">
                    <ScaleIcon className="w-8 h-8 text-yellow-500" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Average BMI</span>
                      <span className="text-lg font-bold text-gray-800">
                        {getAverageBMI(records)}
                      </span>
                    </div>
                  </div>

                  {/* Latest Record */}
                  <div className="flex items-center gap-4 bg-green-50 rounded-xl p-4 shadow hover:shadow-md transition">
                    <CubeTransparentIcon className="w-8 h-8 text-green-500" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        Latest Record
                      </span>
                      <span className="text-lg font-bold text-gray-800">
                        {latestRecord?.visitDate
                          ? new Date(
                              latestRecord.visitDate
                            ).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Next Date */}
                  <div className="flex items-center gap-4 bg-red-50 rounded-xl p-4 shadow hover:shadow-md transition">
                    <CalendarDaysIcon className="w-8 h-8 text-red-500" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Next Date</span>
                      <span className="text-lg font-bold text-gray-800">
                        {getNextVisitDate(latestRecord)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

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
                                  value={
                                    selectedRecord.breastExamination ?? "-"
                                  }
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
                                    : selectedRecord.smokingHabits ??
                                      "No details."
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
                            Trend Comparison (Last {comparisonData.length}{" "}
                            Visits)
                          </h4>
                          <ResponsiveContainer width="100%" height="90%">
                            <LineChart
                              data={comparisonData}
                              margin={{
                                top: 10,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                              />
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

              {/* Visits / Records card */}
              <UserRecordsCard
                records={records}
                onRecordOpen={handleRecordOpen}
                className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-transform hover:scale-105 duration-300"
              />
            </div>
          </div>
        </div>

        <AppFooter />
      </main>
    </div>
  );
}

export default UserDashboard;
