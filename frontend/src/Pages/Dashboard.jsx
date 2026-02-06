import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../utils/api";

import {
  BuildingOffice2Icon,
  UserGroupIcon,
  BanknotesIcon,
  TruckIcon,
  CalendarDaysIcon,
  ArrowUpRightIcon,
  ChevronRightIcon,
  UserPlusIcon,
  FireIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

import AppSidebar from "../Components/AppSidebar";
import AppHeader from "../Components/AppHeader";
import AppFooter from "../Components/AppFooter";
import RegisterPatient from "./RegisterPatient";
import EditPatientModal from "../Components/EditPatientModal";
import SlidingStatCards from "../Components/SlidingStatCards";

// Small stat cards
const StatCard = ({ icon, title, value, sub, onClick }) => {
  const IconComponent = icon;
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4
  h-full flex flex-col justify-between
  hover:shadow-md transition-shadow
  ${onClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
    >
      <div className="flex items-center">
        <div className="rounded-lg bg-red-50 text-red-600 p-2 mr-3">
          <IconComponent className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="text-xl font-semibold text-gray-800">{value}</div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </div>
      {sub && <div className="mt-2 text-xs text-gray-500">{sub}</div>}
    </div>
  );
};
// Red promo banner
const PromoBanner = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

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
    <div className="w-full flex justify-between items-start mb-6">
      {/* Promo Banner */}
      <div className="flex-1">
        <div className="relative overflow-hidden rounded-xl p-6 md:p-7 lg:p-8 bg-gradient-to-r from-red-600 to-red-600 text-white shadow-sm">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex items-center">
            <div className="flex-1">
            <div
                className="text-3xl md:text-4xl font-bold leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                CPSTL Medical Center
              </div>
              
              <div className="mt-2 text-xl text-white/90"
              style={{ fontFamily: "'Playfair Display', serif" }}>
                We hope you have a productive and pleasant day ahead. All the latest updates and essential data are available here to support your daily tasks and decision-making.
              </div>
              <div className="mt-2 flex items-center text-sm text-red-50"
              style={{ fontFamily: "'Playfair Display', serif" }}>
                <CalendarDaysIcon className="w-4 h-4 mr-1 opacity-90" />
                {formattedDate} · {formattedTime}
              </div>
            </div>
            <div className="hidden md:block ml-6">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src="/doctor.jpg"
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple responsive SVG line chart
const LineChartCard = () => {
  const [selectedView, setSelectedView] = useState("daily");
  const [chartData, setChartData] = useState({ labels: [], counts: [] });

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoint =
          selectedView === "daily"
            ? "/patientmedicalrecords/stats/daily"
            : selectedView === "monthly"
              ? "/patientmedicalrecords/stats/monthly"
              : "/patientmedicalrecords/stats/yearly";

        const res = await api.get(endpoint);
        let data = res.data.data || [];

        //fill missing last 7 days
        if (selectedView === "daily") {
          const days = [];
          const map = {};

          data.forEach((d) => {
            map[d.day] = d.count;
          });

          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const key = date.toISOString().slice(0, 10); // yyyy-mm-dd
            days.push({
              day: key,
              count: map[key] ?? 0,
            });
          }

          data = days;
        }

        // Show only last month + current month when view = monthly
        if (selectedView === "monthly" && data.length > 0) {
          const now = new Date();
          const currentMonth = now.getMonth(); // 0-11
          const currentYear = now.getFullYear();
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear =
            currentMonth === 0 ? currentYear - 1 : currentYear;

          // Convert month names to numbers for comparison
          const monthMap = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
          };

          // Filter data for last and current month
          data = data.filter((d) => {
            if (!d.month) return false;
            const [mon, yearStr] = d.month.split(" ");
            const monthNum = monthMap[mon];
            const yearNum = parseInt(yearStr);
            return (
              (monthNum === currentMonth && yearNum === currentYear) ||
              (monthNum === lastMonth && yearNum === lastMonthYear)
            );
          });
        }

        // Update chart data
        setChartData({
          labels: data.map((d) =>
            selectedView === "daily"
              ? new Date(d.day).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })
              : selectedView === "monthly"
                ? d.month
                : d.year,
          ),

          counts: data.map((d) => d.count),
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [selectedView]);

  // Calculate SVG paths
  const { pathD, areaD, points } = useMemo(() => {
    const { counts } = chartData;
    if (!counts || counts.length === 0)
      return { pathD: "", areaD: "", points: [] };

    const w = 680;
    const h = 240;
    const padX = 24;
    const padY = 24;
    const innerW = w - padX * 2;
    const innerH = h - padY * 2;

    const maxY = Math.max(...counts) * 1.1 || 1;
    const stepX = innerW / (counts.length - 1 || 1);

    const pts = counts.map((val, idx) => {
      const x = padX + idx * stepX;
      const y = padY + (innerH - (val / maxY) * innerH);
      return { x, y, val };
    });

    const d = pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`)
      .join(" ");
    const area = `${d} L ${pts[pts.length - 1].x},${h - padY} L ${pts[0].x},${
      h - padY
    } Z`;

    return { pathD: d, areaD: area, points: pts };
  }, [chartData]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between ">
        <div>
          <div className="text-base font-semibold text-gray-800">
            Medical center Visits Statistics
          </div>
          <div className="text-xs text-gray-500">
            {selectedView === "daily"
              ? "Visits over the last 7 days"
              : selectedView === "monthly"
                ? "Visits over the last 12 months"
                : "Visits over the last 5 years"}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedView("daily")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              selectedView === "daily"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setSelectedView("monthly")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              selectedView === "monthly"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedView("yearly")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              selectedView === "yearly"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="px-2 py-4 md:px-4">
        <svg viewBox="0 0 680 240" className="w-full h-56">
          {/* Grid lines */}
          <g stroke="#e5e7eb" strokeWidth="1">
            <line x1="24" y1="40" x2="656" y2="40" />
            <line x1="24" y1="100" x2="656" y2="100" />
            <line x1="24" y1="160" x2="656" y2="160" />
            <line x1="24" y1="216" x2="656" y2="216" />
          </g>

          {/* Area */}
          <path d={areaD} fill="url(#areaFill)" />

          {/* Line */}
          <path d={pathD} fill="none" stroke="#ef4444" strokeWidth="2.5" />

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3.5" fill="#ef4444" />
            </g>
          ))}

          {/* Gradients */}
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
            </linearGradient>
          </defs>
        </svg>

        {/* X labels */}
<div className="flex justify-center -mt-2">
  <div
    className="grid text-[10px] text-gray-500"
    style={{
      width: 680, 
      gridTemplateColumns: `repeat(${chartData.labels.length}, 1fr)`,
      paddingLeft: 24,
      paddingRight: 24,
    }}
  >
    {chartData.labels.map((label, i) => (
      <div key={i} className="text-center">
        {label}
      </div>
    ))}
  </div>
</div>

      </div>
    </div>
  );
};

const DoctorsListCard = () => {
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [searchEPF, setSearchEPF] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientsAndStaff = async () => {
      try {
        const [patientsRes, staffRes] = await Promise.all([
          api.get("/patients"),
          api.get("/staff"),
        ]);
        setPatients(patientsRes.data || []);
        setStaff(staffRes.data || []);
      } catch (err) {
        console.error("Error fetching patients or staff:", err);
      }
    };
    fetchPatientsAndStaff();
  }, []);

  const combinedList = [
    ...patients.map((p) => ({
      ...p,
      epf: p.epfNo,
      type: "Patient",
    })),
    ...staff.map((s) => ({
      ...s,
      epf: s.epfNumber,
      type: "Staff",
    })),
  ];

  const filteredList = combinedList.filter((item) =>
    item.epf?.toLowerCase().includes(searchEPF.toLowerCase()),
  );

  //Calculate age from DOB 
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return null;

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

  // Map alcohol summary to form
  const mapAlcoholSummaryToForm = (summary) => {
    if (!summary)
      return {
        consumeAlcohol: "No",
        typeOfAlcohol: "",
        drinksPerWeek: 0,
        alcoholComments: "",
      };
    const lower = summary.toLowerCase();
    if (lower.includes("no alcohol") || lower.includes("non-drinker"))
      return {
        consumeAlcohol: "No",
        typeOfAlcohol: "",
        drinksPerWeek: 0,
        alcoholComments: summary,
      };
    return {
      consumeAlcohol: "Yes",
      typeOfAlcohol: "",
      drinksPerWeek: 0,
      alcoholComments: summary,
    };
  };

  // Map smoking summary to habit
  const mapSmokingSummaryToHabit = (summary) => {
    if (!summary) return "";
    const lower = summary.toLowerCase();
    if (lower.includes("regular")) return "Regular";
    if (lower.includes("occasional")) return "Occasional";
    if (lower.includes("non-smoker") || lower.includes("no smoking"))
      return "No";
    return "";
  };

  // Parse currentProblems
  const parseCurrentProblems = (currentProblems) => {
    const obj = {
      bmiCategory: "",
      getwaistCategory: "",
      visionCategory: "",
      diabetesCategory: "",
      bpCategory: "",
      consumeAlcohol: "",
      alcoholSummary: "",
      smokingHabits: "",
      smokingSummary: "",
      otherIssues: "",
    };

    if (!currentProblems) return obj;

    // If currentProblems is an object
    if (typeof currentProblems === "object") {
      obj.bmiCategory = currentProblems.BMI || currentProblems.bmi || "";
      obj.getwaistCategory =
        currentProblems.Waist || currentProblems.waist || "";
      obj.visionCategory =
        currentProblems.Vision || currentProblems.vision || "";
      obj.diabetesCategory =
        currentProblems.Diabetes || currentProblems.diabetes || "";
      obj.bpCategory =
        currentProblems["Blood Pressure"] ||
        currentProblems.bloodPressure ||
        "";

      // Smoking
      obj.smokingSummary =
        currentProblems.Smoking || currentProblems.smoking || "";
      obj.smokingHabits = mapSmokingSummaryToHabit(obj.smokingSummary);

      // Alcohol
      const alcoholMapped = mapAlcoholSummaryToForm(
        currentProblems.Alcohol || currentProblems.alcohol || "",
      );
      obj.consumeAlcohol = alcoholMapped.consumeAlcohol;
      obj.alcoholSummary = alcoholMapped.alcoholComments;

      return obj;
    }

    // If currentProblems is a string
    if (typeof currentProblems === "string") {
      const pairs = currentProblems.split(";");

      pairs.forEach((entry) => {
        const [key, val] = entry.split(":").map((x) => x.trim());
        if (!key || !val) return;

        switch (key.toLowerCase()) {
          case "bmi":
            obj.bmiCategory = val;
            break;
          case "waist":
            obj.getwaistCategory = val;
            break;
          case "vision":
            obj.visionCategory = val;
            break;
          case "diabetes":
            obj.diabetesCategory = val;
            break;
          case "blood pressure":
            obj.bpCategory = val;
            break;
          case "smoking":
            obj.smokingSummary = val;
            obj.smokingHabits = mapSmokingSummaryToHabit(val);
            break;

          case "alcohol":
            const alcoholData = mapAlcoholSummaryToForm(val);
            obj.consumeAlcohol = alcoholData.consumeAlcohol;
            obj.alcoholSummary = alcoholData.alcoholComments;
            break;

          default:
            obj.otherIssues += `${key}: ${val}; `;
        }
      });

      return obj;
    }

    return obj;
  };

  // Enhanced handleProgressClick
  const handleProgressClick = async (patient) => {
    try {
      const patientId = patient._id || patient.id;

      const res = await api.get(`/patientmedicalrecords/${patientId}/latest`);

      let latestRecord = res.data?.latestRecord || {};

      const parsed = parseCurrentProblems(
        latestRecord.currentProblems || latestRecord.currentProblemsString,
      );

      latestRecord = { ...latestRecord, ...parsed };

      if (!latestRecord.age) {
        latestRecord.age = calculateAge(patient.dateOfBirth || patient.dob);
      }

      navigate("/AddNewPatient", {
        state: {
          patient,
          latestRecord,
          isNewRecord: false,
        },
      });
    } catch (err) {
      console.error("Error fetching latest medical record:", err);
      const age = calculateAge(patient.dateOfBirth || patient.dob);

      navigate("/AddNewPatient", {
        state: {
          patient,
          latestRecord: { age },
          isNewRecord: true,
        },
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full h-full">
      {/* HEADER */}
      <div className="px-5 py-4 bg-red-500 text-white">
        <div className="text-base font-semibold">Patients List</div>
        <div className="text-xs text-red-100">
          Quick overview of all registered users
        </div>
      </div>

      {/* SEARCH */}
      <div className="px-5 py-3 border-b border-gray-100">
        <input
          type="text"
          placeholder="Search by EPF No"
          value={searchEPF}
          onChange={(e) => setSearchEPF(e.target.value)}
          className="w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      {/* LIST */}
      <div className="divide-y divide-gray-100 overflow-y-auto h-[600px]">
        {filteredList.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-10">
            No patients found
          </div>
        ) : (
          filteredList.map((item, i) => (
            <div
              key={i}
              className="px-5 py-3 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-semibold">
                    {item.name?.charAt(0) || "?"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500">{item.epfNo}</div>
                </div>
              </div>

              <button
                onClick={() => handleProgressClick(item)}
                className="text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 px-2 py-1 rounded-md"
              >
                Progress
              </button>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedPatient && (
        <EditPatientModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          patient={selectedPatient}
        />
      )}
    </div>
  );
};

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((s) => !s);
  const closeSidebar = () => setIsSidebarOpen(false);
  const [totalPatients, setTotalPatients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [staffCount, setStaffCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highRiskStats, setHighRiskStats] = useState([]);
  const [highRiskCountStats, setHighRiskCountStats] = useState([]);

  const navigate = useNavigate();

  //sliding stat card
  const slidingStats = [
    {
      icon: BuildingOffice2Icon,
      title: "Total Patients",
      value: totalPatients,
      sub: "Overall registered",
    },
    {
      icon: UserGroupIcon,
      title: "Today Checkouts",
      value: todayCount,
      sub: "Updated today",
    },
    {
      icon: UserGroupIcon,
      title: "Staff Members",
      value: staffCount,
      sub: "Medical Center",
    },
  ];

  useEffect(() => {
    const fetchHighRisk = async () => {
      try {
        const res = await api.get("/patientmedicalrecords/dashboard/high-risk");

        const formatted = res.data.data.map((item) => ({
          icon:
            item.type === "BMI"
              ? ArrowTrendingUpIcon
              : item.type === "SUGAR"
                ? FireIcon
                : HeartIcon,
          title:
            item.type === "BMI"
              ? "Highest BMI"
              : item.type === "SUGAR"
                ? "Highest Blood Sugar"
                : "Highest Blood Pressure",
          value: item.value,
          sub: `${item.name} • ${item.epfNo} • ${item.department}`,
        }));

        setHighRiskStats(formatted);
      } catch (err) {
        console.error("High risk fetch error:", err);
      }
    };

    fetchHighRisk();
  }, []);

  useEffect(() => {
    const fetchHighRiskCounts = async () => {
      try {
        const res = await api.get(
          "/patientmedicalrecords/dashboard/high-risk-counts",
        );

        const data = res.data.data;

        const formatted = [
          {
            icon: ArrowTrendingUpIcon,
            title: "High BMI Patients",
            value: data.BMI,
            sub: "All departments",
          },
          {
            icon: HeartIcon,
            title: "High BP Patients",
            value: data.BP,
            sub: "All departments",
          },
          {
            icon: FireIcon,
            title: "High Blood Sugar Patients",
            value: data.SUGAR,
            sub: "All departments",
          },
        ];

        setHighRiskCountStats(formatted);
      } catch (err) {
        console.error("High risk count fetch error:", err);
      }
    };

    fetchHighRiskCounts();
  }, []);

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("userData"))?.role;
    if (role !== "admin") {
      navigate("/Dashboard");
    }
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await api.get("/patients/count");
        setTotalPatients(res.data.count ?? 0);
      } catch (err) {
        console.error("Error fetching patient count:", err.response || err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  useEffect(() => {
    const fetchStaffCount = async () => {
      try {
        const res = await api.get("/staff/count");
        setStaffCount(res.data.count);
      } catch (error) {
        console.error("Error fetching staff count:", error);
      }
    };

    fetchStaffCount();
  }, []);

  const fetchTodayPatientCount = async () => {
    try {
      const res = await api.get("/patientmedicalrecords/records/today/count");
      setTodayCount(res.data.count);
    } catch (err) {
      console.error("Error fetching today's patient count:", err);
    }
  };

  useEffect(() => {
    fetchTodayPatientCount();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <AppSidebar
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={closeSidebar}
        currentPage="Dashboard"
        userRole={JSON.parse(localStorage.getItem("userData"))?.role}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Top Row: Promo Banner + Right Side Buttons */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            {/* Promo Banner */}
            <div className="lg:col-span-2">
              <PromoBanner />

              {/* Small Stats Cards below Promo Banner */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-fr">
                
                {/* Total Patients */}
                <div className="md:col-span-3">
                  <StatCard
                    icon={BuildingOffice2Icon}
                    value={loading ? "..." : totalPatients}
                    title="Total Patients"
                    sub={error ? "Error loading" : "Updated today"}
                  />
                </div>

                {/* Today Checkouts */}
                <div className="md:col-span-3">

                  <StatCard
                    icon={UserGroupIcon}
                    value={todayCount}
                    title="Today Checkouts"
                    sub="Updated today"
                    onClick={() =>
                      navigate("/ManagePatients", {
                        state: { filter: "todayCheckouts" },
                      })
                    }
                  />
                </div>

                {/* Staff */}
                {/* <div className="md:col-span-3">
  <StatCard
    icon={UserGroupIcon}
    value={staffCount}
    title="Staff Members"
    sub="Medical Center"
  /> get todays counts with allpatients and getting with all powerd
</div> */}

                {/* Highest individual risk */}
                <div className="md:col-span-3 h-full">
                  <SlidingStatCards stats={highRiskStats} interval={4000} />
                </div>

                {/* High-risk counts */}
                <div className="md:col-span-3 h-full">
                  <SlidingStatCards
                    stats={highRiskCountStats}
                    interval={4000}
                  />
                </div>
              </div>
              {/* Middle Row: Chart */}
              <div className="mt-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-4">
                  <LineChartCard />
                </div>
              </div>
            </div>

            {/* Right Side: Buttons + Doctor List */}
            <div className="flex flex-col gap-4">
              {/* Buttons at the top-right */}

              {/* Doctor List Card below buttons */}
              <DoctorsListCard />
            </div>
          </div>
        </div>

        <AppFooter />
      </main>
    </div>
  );
}

export default Dashboard;
