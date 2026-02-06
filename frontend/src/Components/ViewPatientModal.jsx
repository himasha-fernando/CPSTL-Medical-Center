import React, { useEffect, useState } from "react";
import {
  XMarkIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import api from "../utils/api";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PatientReport from "./PatientReport";

/* HELPERS */
const Row = ({ label, value }) => (
  <div className="flex text-sm border-b border-gray-200 py-1">
    <div className="w-48 font-semibold text-gray-700">{label}</div>
    <div className="flex-1 text-gray-900">{value || "—"}</div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="border border-gray-300 rounded-md">
    <div className="bg-gray-100 px-4 py-2 font-bold text-gray-800 text-sm uppercase tracking-wide border-b">
      {title}
    </div>
    <div className="p-4 space-y-1">{children}</div>
  </div>
);

/* COMPONENT */
const ViewPatientModal = ({ patient, isOpen, onClose }) => {
  const [currentRecord, setCurrentRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  // Load patient and reset selection
  useEffect(() => {
    if (patient) {
      setCurrentRecord(patient);
      setSelectedRecordId(null);
    }
  }, [patient]);

  // Fetch patient history and load latest
useEffect(() => {
  if (!patient?.patient_id) return;

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/patientmedicalrecords/${patient.patient_id}/records`);
      const records = Array.isArray(res.data) ? res.data : [];
      setHistory(records);

      if (records.length > 0) {
        // Records are DESC by visitDate, so first one is latest
        const latest = records[0];
        setSelectedRecordId(latest.id);
        setCurrentRecord(latest);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  fetchHistory();
}, [patient]);


  if (!isOpen || !patient) return null;

  const calculateAge = (dob) => {
    if (!dob) return "";
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
    )
      age--;
    return age;
  };

  const age = calculateAge(patient.dateOfBirth);

  // Load selected record
  const loadRecordById = async (recordId) => {
    if (!recordId) return;
    setSelectedRecordId(recordId); // update selection immediately

    try {
      const res = await api.get(`/patientmedicalrecords/record/${recordId}`);
      // Adjust this depending on your API structure
      const record = res.data.record || res.data;
      setCurrentRecord(record);
    } catch (err) {
      console.error("Failed to load record", err);
    }
  };
  
  /* PDF EXPORT */
const handleDownloadPDF = async () => {
  try {
    const res = await api.get(`/patientmedicalrecords/${patient.patient_id}/latest`);
    // Merge patient info with record
    const pdfPatient = { ...patient, ...res.data.latestRecord };

    // Trigger PDF download
    return (
      <PDFDownloadLink
        document={<PatientReport patient={pdfPatient} />}
        fileName={`${patient.name.replace(/\s+/g, "_")}_MedicalReport.pdf`}
      >
        {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
      </PDFDownloadLink>
    );
  } catch (err) {
    console.error(err);
    alert("Failed to generate PDF");
  }
};


  /* MEDICAL LOGIC HELPERS */
  const getDiabetesCategory = (rbsValue) => {
    const value = parseFloat(rbsValue);
    if (isNaN(value)) return "";
    if (value < 140) return "Normal";
    if (value >= 141 && value <= 199) return "Prediabetes";
    if (value >= 200) return "Diabetes";
    return "";
  };

  const getHypertensionCategory = (systolic, diastolic) => {
    const s = parseFloat(systolic);
    const d = parseFloat(diastolic);
    if (isNaN(s) || isNaN(d)) return "";
    if (s < 130 && d < 85) return "Normal";
    if ((s >= 130 && s <= 139) || (d >= 85 && d <= 89)) return "High Normal BP";
    if ((s >= 140 && s <= 159) || (d >= 90 && d <= 99)) return "Grade 1 Hypertension";
    if (s >= 160 || d >= 100) return "Grade 2 Hypertension";
    if (s >= 140 && d < 90) return "Isolated Systolic Hypertension";
    return "";
  };

  const getWaistCategory = (waist, gender) => {
    if (!waist || !gender) return "";
    if (gender === "Male") return waist >= 90 ? "Abdominal Obesity" : "Normal";
    if (gender === "Female") return waist >= 80 ? "Abdominal Obesity" : "Normal";
    return "";
  };

  const getAlcoholAssessment = (record) => {
    if (!record?.alcoholSummary) return null;
    const value = record.alcoholSummary.toLowerCase();
    if (value.includes("low-risk") || value.includes("no alcohol") || value.includes("non drinker"))
      return { severity: "low", message: "Low-risk alcohol use" };
    if (value.includes("occasional") || value.includes("moderate") || value.includes("social"))
      return { severity: "moderate", message: "Occasional alcohol use — moderation advised" };
    if (value.includes("high-risk") || value.includes("abuse") || value.includes("depend") || value.includes("heavy") || value.includes("daily"))
      return { severity: "high", message: "High-risk alcohol use — medical support advised" };
    return { severity: "moderate", message: record.alcoholSummary };
  };

  const getSmokingAssessment = (habit) => {
    if (!habit || habit.trim() === "") return null;
    const value = habit.trim().toLowerCase();
    if (value.includes("non")) return { severity: "low", message: "Non smoker" };
    if (value.includes("occasion")) return { severity: "moderate", message: "Occasional smoking — quitting advised" };
    if (value.includes("regular")) return { severity: "high", message: "Regular smoker — high health risk" };
    return { severity: "moderate", message: habit };
  };

  const getIndicatorColorBySeverity = (severity) => {
    if (!severity) return "bg-gray-100 text-gray-700";
    if (severity === "low") return "bg-green-100 text-green-800";
    if (severity === "moderate") return "bg-yellow-100 text-yellow-800";
    if (severity === "high") return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };

  const getIndicatorColor = (category) => {
    if (!category) return "bg-gray-100 text-gray-700";
    const v = category.toLowerCase();
    if (v.includes("normal") || v.includes("low") || v.includes("non")) return "bg-green-100 text-green-800";
    if (v.includes("moderate") || v.includes("prediabetes") || v.includes("high normal")) return "bg-yellow-100 text-yellow-800";
    if (v.includes("diabetes") || v.includes("hypertension") || v.includes("obesity") || v.includes("high-risk") || v.includes("regular smoker")) return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };

  const getVisionCategory = (rightEye, leftEye) => {
  if (!rightEye || !leftEye) return "";

  const normalCombinations = [
    ["6/6", "6/6"],
    ["6/12", "6/12"],
    ["6/6", "6/18"],
    ["6/18", "6/6"],
  ];

  const isNormal = normalCombinations.some(
    ([r, l]) =>
      r.trim().toLowerCase() === rightEye.trim().toLowerCase() &&
      l.trim().toLowerCase() === leftEye.trim().toLowerCase()
  );

  return isNormal ? "Normal" : "Poor Vision";
};


  // Categories
  const diabetesCategory = getDiabetesCategory(currentRecord?.rbs);
  const bpCategory = getHypertensionCategory(currentRecord?.systolicBP, currentRecord?.diastolicBP);
  const waistCategory = getWaistCategory(currentRecord?.waist, patient?.gender);
  const visionCategory = getVisionCategory(currentRecord?.visionRight,currentRecord?.visionLeft);
  const bmiCategory = currentRecord?.bmi == null ? null :
    currentRecord.bmi < 18.5 ? "Underweight" :
    currentRecord.bmi < 25 ? "Normal" :
    currentRecord.bmi < 30 ? "Overweight" :
    currentRecord.bmi < 35 ? "Obesity Class I" :
    currentRecord.bmi < 40 ? "Obesity Class II" : "Obesity Class III";

  const alcoholAssessment = getAlcoholAssessment(currentRecord);
  const smokingAssessment = getSmokingAssessment(currentRecord?.smokingHabits || currentRecord?.smoking || currentRecord?.smokingStatus || "");

  // RENDER
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-6xl rounded-md shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">CONSOLIDATED MEDICAL REPORT</h2>
            <p className="text-sm text-gray-600">{patient.name} · {patient.registrationNo}</p>

           {history.length > 0 && (
  <select
    className="border rounded-lg px-3 py-1 text-sm bg-white mt-2"
    value={selectedRecordId || ""}
    onChange={(e) => {
      const id = e.target.value;
      setSelectedRecordId(id);
      const selected = history.find((r) => r.id.toString() === id.toString());
      if (selected) setCurrentRecord(selected);
    }}
  >
    <option value="">Change Date</option>
    {history.map((rec) => (
      <option key={rec.id} value={rec.id}>
        {rec.visitDate
          ? new Date(rec.visitDate).toLocaleDateString("en-GB")
          : "—"}
      </option>
    ))}
  </select>
)}

          </div>
          <div className="flex gap-2">
            <button onClick={onClose}>
              <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-black" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">

          {/* Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section title="Patient Information">
              <Row label="Full Name" value={patient.name} />
              <Row label="Registration No" value={patient.registrationNo} />
              <Row label="EPF No" value={patient.epfNo} />
              <Row label="Gender" value={patient.gender} />
              <Row label="Date of Birth" value={patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "—"} />
              <Row label="Age" value={age ? `${age} years` : "—"} />
            </Section>

            <Section title="Contact & Status">
              <Row label="Contact No" value={patient.contactNo} />
              <Row label="Department" value={patient.department} />
              <Row label="Status" value={patient.status || "Active"} />
              <Row label="Patient Register Date" value={patient.createdAt ? patient.createdAt.split(" ")[0] : "—"} />
              <Row label="Medical Record Date" value={currentRecord?.visitDate ? currentRecord.visitDate.split(" ")[0] : "—"} />
            </Section>
          </div>

          {/* Physical */}
          <Section title="Physical Measurements">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Row label="Height" value={currentRecord?.height ? `${currentRecord.height} cm` : "—"} />
              <Row label="Weight" value={currentRecord?.weight ? `${currentRecord.weight} kg` : "—"} />
              <Row label="BMI" value={currentRecord?.bmi ?? "—"} />
              <Row label="Waist" value={currentRecord?.waist ? `${currentRecord.waist} cm` : "—"} />
            </div>
          </Section>

          {/* Vitals */}
          <Section title="Vital Signs & Laboratory">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Row label="Blood Pressure" value={currentRecord?.systolicBP && currentRecord?.diastolicBP ? `${currentRecord.systolicBP}/${currentRecord.diastolicBP} mmHg` : "—"} />
              <Row label="RBS" value={currentRecord?.rbs ?? "—"} />
              <Row label="FBS" value={currentRecord?.fbs ?? "—"} />
              <Row label="Vision (Left)" value={currentRecord?.visionLeft ?? "—"} />
              <Row label="Vision (Right)" value={currentRecord?.visionRight ?? "—"} />
            </div>
          </Section>

          {/* History */}
          <Section title="Current Problems">
            <div className="flex flex-wrap gap-2 text-sm">
              {bmiCategory && <span className={`px-3 py-1 rounded-full text-xs ${getIndicatorColor(bmiCategory)}`}>BMI: {bmiCategory}</span>}
              {waistCategory && <span className={`px-3 py-1 rounded-full text-xs ${getIndicatorColor(waistCategory)}`}>Waist: {waistCategory}</span>}
              {diabetesCategory && <span className={`px-3 py-1 rounded-full text-xs ${getIndicatorColor(diabetesCategory)}`}>Diabetes: {diabetesCategory}</span>}
              {bpCategory && <span className={`px-3 py-1 rounded-full text-xs ${getIndicatorColor(bpCategory)}`}>Blood Pressure: {bpCategory}</span>}
               {visionCategory && <span className={`px-3 py-1 rounded-full text-xs ${getIndicatorColor(visionCategory)}`}>Vision: {visionCategory}</span>}
              {alcoholAssessment && <span className={`px-3 py-1 rounded-full text-xs ${getIndicatorColorBySeverity(alcoholAssessment.severity)}`}>Alcohol: {alcoholAssessment.message}</span>}
              {smokingAssessment && <span className={`px-3 py-1 rounded-full text-xs ${getIndicatorColorBySeverity(smokingAssessment.severity)}`}>Smoking: {smokingAssessment.message}</span>}
            </div>
          </Section>

          {/* Treatment */}
          <Section title="Treatment & Recommendations">
            <Row label="Treatment Plan" value={currentRecord?.treatmentPlan ?? "—"} />
            <Row label="Smoking Cessation Advice" value={currentRecord?.smokingCessationAdvice ?? "—"} />
            <Row label="Alcohol Abuse Advice" value={currentRecord?.alcoholAbuseAdvice ?? "—"} />
          </Section>

          {/* Export */}
        <div className="flex justify-end">
  <PDFDownloadLink
  document={<PatientReport patient={{ ...patient, ...currentRecord }} />}
  fileName={`${patient.name.replace(/\s+/g, "_")}_${currentRecord?.visitDate?.split("T")[0] || "record"}.pdf`}
  className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
>
  {({ loading }) =>
    loading ? "Generating PDF..." : (
      <>
        <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
        Export PDF
      </>
    )
  }
</PDFDownloadLink>

</div>

        </div>

        {/* FOOTER */}
        <div className="border-t px-6 py-3 text-xs text-gray-500 text-center">
          Confidential Medical Record — Authorized Use Only
        </div>
      </div>
    </div>
  );
};

export default ViewPatientModal;
