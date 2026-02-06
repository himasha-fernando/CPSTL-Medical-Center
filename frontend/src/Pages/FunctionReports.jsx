import React, { useEffect, useState } from "react";	
import api from "../utils/api"; 
import AppSidebar from "../Components/AppSidebar"; 
import AppHeader from "../Components/AppHeader"; 
import AppFooter from "../Components/AppFooter"; 
import { Scale, Ruler, Droplet, HeartPulse, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts"; 

const CATEGORY_COLORS = { 
// BMI 
"Underweight": "#38bdf8", // Sky Blue 
"Normal": "#22c55e", // Green 
"Overweight": "#facc15", // Yellow 
"Obesity Class I": "#f97316", // Orange 
"Obesity Class II": "#ef4444", // Red
 "Obesity Class III": "#7f1d1d", // Dark Red 

// Diabetes 
"Prediabetes": "#f59e0b", // Amber
 "Diabetes": "#dc2626", // Strong Red

 // BP 
"High Normal BP": "#eab308", // Yellow
 "Grade 1 Hypertension": "#f97316",
 "Grade 2 Hypertension": "#b91c1c",
 "Isolated Systolic Hypertension": "#7f1d1d",

 // Waist 
"Abdominal Obesity": "#dc2626", 

// Vision 
 "Poor Vision": "#dc2626", 
}; 

const LuxuryBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 italic font-medium">
        No data to display
      </div>
    );
  }

  return (
    <div className="
      w-full
      min-h-[420px]
      rounded-[32px]
      bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300
      p-8
      shadow-[0_35px_100px_rgba(0,0,0,0.1)]
      border border-gray-500/70
      flex flex-col
      transition-all duration-700
      hover:shadow-[0_45px_120px_rgba(0,0,0,0.15)]
      hover:scale-[1.01]
      relative
      overflow-hidden
    ">
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/30 via-transparent to-purple-100/30 animate-pulse opacity-50" />
      
      {/* Glass morphism layer */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/5" />
      
      {/* Title Section */}
      <div className="relative z-10 mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-clip-text text-transparent tracking-tight">
          Performance Overview
        </h3>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2" />
      </div>

      {/* Chart Container */}
      <div className="relative z-10 flex-1">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart
            data={data}
            margin={{ top: 60, right: 30, left: 10, bottom: 40 }}
          >
            {/* No grid for clean look */}
            <CartesianGrid 
              strokeDasharray="0" 
              stroke="transparent" 
              vertical={false}
              horizontal={false}
            />  

            {/* X-axis with premium styling */}
            <XAxis
              dataKey="name"
              axisLine={{ stroke: '#d1d5db', strokeWidth: 2 }}
              tickLine={false}
              tick={{ 
                fontSize: 14, 
                fill: "#6b7280", 
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}
              dy={10}
            />

            {/* Hide Y-axis */}
            <YAxis hide />

            {/* Premium tooltip */}
            <Tooltip
              cursor={{ fill: "rgba(59,130,246,0.1)" }}
              contentStyle={{
                background: "rgba(255,255,255,0.98)",
                backdropFilter: "blur(20px)",
                borderRadius: 16,
                border: "1px solid rgba(59,130,246,0.2)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                padding: "12px 16px",
                fontSize: 13,
                fontWeight: 600,
                color: "#374151"
              }}
              labelStyle={{
                color: "#1f2937",
                fontWeight: 700,
                marginBottom: 6,
                fontSize: 14,
                letterSpacing: '0.3px'
              }}
              itemStyle={{
                color: "#3b82f6",
                fontWeight: 600
              }}
            />

            {/* Premium bars with circular labels */}
            <Bar
              dataKey="value"
              barSize={50}
              radius={[25, 25, 0, 0]}
              animationDuration={1200}
              animationBegin={0}
              label={({ x, y, width, value, index }) => {
                const baseColor = CATEGORY_COLORS[data[index].name] || "#60a5fa";
                return (
                  <g>
                    {/* Outer glow circle */}
                    <circle
                      cx={x + width / 2}
                      cy={y - 25}
                      r="28"
                      fill={baseColor}
                      opacity="0.2"
                      filter="url(#labelGlow)"
                    />
                    {/* White background circle */}
                    <circle
                      cx={x + width / 2}
                      cy={y - 25}
                      r="24"
                      fill="white"
                      stroke={baseColor}
                      strokeWidth="3"
                    />
                    {/* Value text */}
                    <text
                      x={x + width / 2}
                      y={y - 20}
                      textAnchor="middle"
                      fill={baseColor}
                      fontSize="16"
                      fontWeight="700"
                    >
                      {value}
                    </text>
                  </g>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#modernGrad-${index})`}
                />
              ))}
            </Bar>

            {/* Dynamic modern gradients */}
            <defs>
              {data.map((entry, index) => {
                const baseColor = CATEGORY_COLORS[entry.name] || "#60a5fa";
                return (
                  <linearGradient 
                    key={`modernGrad-${index}`} 
                    id={`modernGrad-${index}`} 
                    x1="0" 
                    y1="0" 
                    x2="0" 
                    y2="1"
                  >
                    <stop offset="0%" stopColor={baseColor} stopOpacity={0.9}/>
                    <stop offset="100%" stopColor={baseColor} stopOpacity={0.3}/>
                  </linearGradient>
                );
              })}
              
              {/* Label glow effect */}
              <filter id="labelGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Premium legend with animated indicators */}
      <div className="relative z-10 flex justify-center gap-6 mt-4 px-6 flex-wrap">
        {data.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-2.5 group cursor-pointer transition-all duration-300 hover:scale-110"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div 
                className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300"
                style={{ backgroundColor: CATEGORY_COLORS[entry.name] || "#60a5fa" }}
              />
              {/* Inner dot */}
              <div
                className="w-3.5 h-3.5 rounded-full relative shadow-lg border-2 border-white"
                style={{ 
                  backgroundColor: CATEGORY_COLORS[entry.name] || "#60a5fa",
                }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-600 tracking-wide group-hover:text-gray-800 transition-colors duration-300">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};





 const ChartSummary = ({ data }) => {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const highest = [...data].sort((a, b) => b.value - a.value)[0];

  return (
    <div className="
      h-full 
      rounded-[28px] 
      bg-gradient-to-br from-slate-50 via-white to-blue-50
      p-8 
      shadow-[0_20px_70px_rgba(0,0,0,0.08)]
      border border-gray-200/60
      backdrop-blur-xl
      relative
      overflow-hidden
      transition-all duration-500
      hover:shadow-[0_25px_90px_rgba(59,130,246,0.12)]
      hover:scale-[1.01]
    ">
      
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/20 via-transparent to-purple-100/20 animate-pulse opacity-40" />
      
      {/* Decorative corner element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-bl-[100px] blur-2xl" />
      
      {/* Content wrapper */}
      <div className="relative z-10">
        
        {/* Header with gradient text */}
        <div className="mb-8 pb-4 border-b border-gray-200/50">
          <h3 className="
            text-2xl 
            font-bold 
            bg-gradient-to-r from-gray-800 via-blue-700 to-gray-800 
            bg-clip-text 
            text-transparent
            tracking-tight
            flex items-center gap-3
          ">
            <span className="w-1.5 h-8 bg-gradient-to-b from-red-500 to-red-500 rounded-full" />
            Summary
          </h3>
        </div>

        {/* TOTAL - Premium Card */}
        <div className="
          mb-6 
          p-6 
          rounded-2xl 
          bg-gradient-to-br from-red-600 to-red-900
          shadow-[0_15px_40px_rgba(59,130,246,0.25)]
          border border-blue-400/30
          relative
          overflow-hidden
          group
          transition-all duration-300
          hover:shadow-[0_20px_50px_rgba(59,130,246,0.35)]
        ">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm font-medium text-white/90 tracking-wide">Total Employees</p>
            </div>
            <p className="text-5xl font-extrabold text-white tracking-tight">
              {total}
              <span className="text-2xl text-white/70 ml-2 font-normal">people</span>
            </p>
          </div>
          
          {/* Decorative dots */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* HIGHEST CATEGORY - Elegant Card */}
        <div className="
          mb-6 
          p-6 
          rounded-2xl 
          bg-white
          shadow-[0_10px_40px_rgba(0,0,0,0.06)]
          border border-gray-200/60
          relative
          overflow-hidden
          group
          transition-all duration-300
          hover:shadow-[0_15px_50px_rgba(0,0,0,0.1)]
          hover:border-gray-300/80
        ">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm font-semibold text-gray-600 tracking-wide">Most Common Category</p>
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            {/* Animated color indicator */}
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full blur-md opacity-50 animate-pulse"
                style={{ backgroundColor: CATEGORY_COLORS[highest.name] }}
              />
              <div
                className="relative h-12 w-12 rounded-2xl shadow-lg flex items-center justify-center border-2 border-white transition-transform duration-300 group-hover:scale-110"
                style={{ 
                  backgroundColor: CATEGORY_COLORS[highest.name],
                  boxShadow: `0 8px 25px ${CATEGORY_COLORS[highest.name]}40`
                }}
              >
                <span className="text-white font-bold text-sm">{highest.value}</span>
              </div>
            </div>
            
            <div>
              <p className="font-bold text-gray-800 text-lg tracking-tight">
                {highest.name}
              </p>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                {((highest.value / total) * 100).toFixed(1)}% of total
              </p>
            </div>
          </div>
        </div>

        {/* MEDICAL INSIGHT - Premium Alert */}
        <div className="
          mt-8 
          p-6 
          rounded-2xl 
          bg-gradient-to-br from-amber-50 via-orange-50 to-red-50
          border-2 border-orange-200/50
          shadow-[0_15px_40px_rgba(251,146,60,0.15)]
          relative
          overflow-hidden
          transition-all duration-300
          hover:shadow-[0_20px_50px_rgba(251,146,60,0.2)]
        ">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500 rounded-full blur-3xl animate-pulse delay-75" />
          </div>
          
          <div className="relative z-10">
            {/* Header with icon */}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-base font-bold bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
                Medical Insight
              </p>
            </div>
            
            <p className="text-sm text-gray-700 leading-relaxed mt-3 font-medium">
              A significant portion of employees fall under{' '}
              <span className="
                font-bold 
                text-orange-700
                px-2 
                py-0.5 
                bg-orange-100 
                rounded-lg
                border border-orange-200
              ">
                {highest.name}
              </span>
              . Preventive screening and lifestyle guidance are recommended.
            </p>
            
            
          </div>
        </div>

      </div>

      {/* Floating decorative elements */}
      <div className="absolute bottom-10 right-10 w-2 h-2 bg-blue-400 rounded-full blur-sm opacity-40 animate-ping" />
      <div className="absolute top-1/3 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full blur-sm opacity-30 animate-pulse" />
    </div>
  );
};

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

const FunctionReports = () => {
 const [search, setSearch] = useState(""); 
const [patients, setPatients] = useState([]);
 const [results, setResults] = useState([]); 
const [modalOpen, setModalOpen] = useState(false); 
const [modalPatients, setModalPatients] = useState([]); 
const [modalTitle, setModalTitle] = useState(""); 
const [chartData, setChartData] = useState([]); 
const [globalType, setGlobalType] = useState("BMI");
const [globalChartData, setGlobalChartData] = useState([]);
const [selectedDepartment, setSelectedDepartment] = useState("ALL");


useEffect(() => { 
api
 .get("/patientmedicalrecords/records/all-patients")
 .then((res) => {

 if (Array.isArray(res.data)) { 
setPatients(res.data);
 }
else if (res.data.data && Array.isArray(res.data.data)) { 
setPatients(res.data.data); 
} 
else {
 console.error("Invalid patients data:", res.data); 
setPatients([]);
 } 
}) 
.catch((err) => console.error("Fetch patients error:", err));
 }, []);



useEffect(() => {
  if (patients.length > 0) {
    const data = buildGlobalBarChartData(globalType, selectedDepartment);
    setGlobalChartData(data);
  }
}, [patients, globalType, selectedDepartment]);





 const getLatestRecordsByEPF = (records) => {
 const map = new Map(); 

records.forEach(r => { 
const key = String(r.epfNo).trim();

 // keep first occurrence 
if (!map.has(key)) {
 map.set(key, r);
 }
 });
 return Array.from(map.values()); 
}; 

const filteredDepartments = departments.filter((d) => 
d.toLowerCase().includes(search.toLowerCase()) 
); 

// Function to normalize vision 
const normalizeVision = (v) => {
 if (!v) return null; 

const match = v.toString().match(/6\/\d+/);
 return match ? match[0] : null;
 };

 const getDiabetesCategory = (rbsValue) => {
 const value = parseFloat(rbsValue);
 if (isNaN(value)) return null; 
if (value < 140) return "Normal"; 
if (value >= 141 && value <= 199) return "Prediabetes"; 
if (value >= 200) return "Diabetes";
 };

 const getHypertensionCategory = (s, d) => {
 s = parseFloat(s); d = parseFloat(d);
 if (isNaN(s) || isNaN(d)) return null;
 if (s < 130 && d < 85) return "Normal";
 if ((s >= 130 && s <= 139) || (d >= 85 && d <= 89)) return "High Normal BP";
 if ((s >= 140 && s <= 159) || (d >= 90 && d <= 99)) return "Grade 1 Hypertension";
 if (s >= 160 || d >= 100) return "Grade 2 Hypertension";
 if (s >= 140 && d < 90) return "Isolated Systolic Hypertension"; }; 

const getWaistCategory = (waist, gender) => {
 if (!waist || !gender) return null; 
if (gender === "Male") return waist >= 90 ? "Abdominal Obesity" :
 "Normal"; if (gender === "Female") return waist >= 80 ? "Abdominal Obesity" :
 "Normal"; 
}; 

// Function to determine vision category 
const getVisionCategory = (r, l) => { 
// If both eyes are missing, ignore the record 
if (!r && !l) return null; 

const right = normalizeVision(r); 
const left = normalizeVision(l);

 if (!right || !left) return "Poor Vision";

 const normalPairs = [ 
["6/6", "6/6"],
 ["6/6", "6/9"], 
["6/9", "6/6"], 
["6/9", "6/9"],
["6/12", "6/12"],
 ["6/6", "6/12"],
 ["6/12", "6/6"],
 ["6/6", "6/18"],
 ["6/18", "6/6"],
 ]; 

return normalPairs.some(([a, b]) => a === right && b === left)
 ? "Normal" 
: "Poor Vision";
 };

 const getBmiCategory = (bmi) => { 
if (bmi == null) return null; 
if (bmi < 18.5) return "Underweight";
 if (bmi < 25) return "Normal"; 
if (bmi < 30) return "Overweight"; 
if (bmi < 35) return "Obesity Class I"; 
if (bmi < 40) return "Obesity Class II";
 return "Obesity Class III"; 
}; 


const buildGlobalBarChartData = (type, department) => {
  const counts = {};

  let records = getLatestRecordsByEPF(patients);

  // filter by department if selected
  if (department !== "ALL") {
    records = records.filter(p => p.department === department);
  }

  records.forEach(p => {
    let category = null;

    if (type === "BMI") category = getBmiCategory(p.bmi);
    if (type === "DIABETES") category = getDiabetesCategory(p.rbs);
    if (type === "BP") category = getHypertensionCategory(p.systolicBP, p.diastolicBP);
    if (type === "WAIST") category = getWaistCategory(p.waist, p.gender);
    if (type === "VISION") category = getVisionCategory(p.visionRight, p.visionLeft);

    if (category) {
      counts[category] = (counts[category] || 0) + 1;
    }
  });

  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));
};





return (
 <div className="flex min-h-screen bg-gray-100"> 
<AppSidebar /> 
<div className="flex-1 flex flex-col">
 <AppHeader /> 
<div className="p-6 space-y-6"> 

{/* SEARCH DEPARTMENT*/} 
<select
  value={selectedDepartment}
  onChange={(e) => setSelectedDepartment(e.target.value)}
  className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
>
  <option value="ALL">All Departments</option>
  {departments.map((dept) => (
    <option key={dept} value={dept}>
      {dept}
    </option>
  ))}
</select>
 

 {/* GLOBAL MEDICAL SUMMARY */}
<div className="space-y-6">

  

  <h2 className="text-2xl font-semibold text-gray-800">
  {globalType} Distribution
  <span className="text-gray-500 text-base ml-2">
    ({selectedDepartment === "ALL" ? "All Departments"  : selectedDepartment})
  </span>
</h2>

{/* BUTTON BAR */}

<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

  {/* LEFT: BUTTON BAR + CHART */}
  <div className="lg:col-span-8 space-y-4">

    {/* BUTTON BAR — centered to chart */}
    <div className="flex justify-center">
      <div
        className="
          flex gap-3
          px-6 py-3/
          rounded-3xl
          bg-white/80 backdrop-blur-xl
          border border-white/50
          shadow-[0_18px_50px_rgba(0,0,0,0.18)]
        "
      >
    {[
      { key: "BMI", icon: <Scale size={16} /> },
      { key: "WAIST", icon: <Ruler size={16} /> },
      { key: "DIABETES", icon: <Droplet size={16} /> },
      { key: "BP", icon: <HeartPulse size={16} /> },
      { key: "VISION", icon: <Eye size={16} /> },
    ].map(btn => {
      const active = globalType === btn.key;

      return (
        <button
          key={btn.key}
          onClick={() => setGlobalType(btn.key)}
          className={`
            flex items-center gap-2
            px-5 py-2
            rounded-2xl
            text-sm font-semibold
            transition-all duration-300
            ${active
              ? "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700"}
          `}
        >
          {btn.icon}
          {btn.key}
        </button>
      );
    })}
  </div>
</div>

  {/* CHART */}
  <LuxuryBarChart data={globalChartData} />
  </div>

  {/* RIGHT: SUMMARY */}
  <div className="lg:col-span-4">
    <ChartSummary data={globalChartData} />
    </div>
  </div>
</div>





 {/* RESULTS TABLE */}
 {results.length > 0 && ( 
<table className="w-full bg-white rounded-2xl shadow mt-6 overflow-hidden">
 <thead className="bg-gray-200"> 
<tr> 
<th className="p-3 text-left">Name</th>
 <th className="p-3 text-left">EPF No</th> 
<th className="p-3 text-left">Value</th> 
<th className="p-3 text-left">DOB</th> 
<th className="p-3 text-left">Contact</th>
 </tr> 
</thead>
<tbody> 
{results.map((p) => (
 <tr key={p.epfNo} className="border-t">
 <td className="p-2">{p.name}</td>
 <td className="p-2">{p.epfNo}</td>
 <td className="p-2">{p.value}</td>
 <td className="p-2">{p.dateOfBirth}</td>
<td className="p-2">{p.contactNo}</td>
 </tr>
 ))} 
</tbody> 
</table> 
)} 
</div>
 <AppFooter /> 
</div>
</div>
 

);
}
 export default FunctionReports;