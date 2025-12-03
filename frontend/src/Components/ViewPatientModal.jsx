import React, { useState } from "react";
import axios from "axios";
import {
  UserCircleIcon,
  EyeIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  SunIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  HeartIcon,
  BeakerIcon,
} from "@heroicons/react/24/solid";

// View Patient Modal
const ViewPatientModal = ({ patient, isOpen, onClose }) => {
  if (!isOpen || !patient) return null;

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age >= 0 ? age : 0;
  };

  // Normalize JSON/array/string to array
  const normalizeToArray = (value) => {
    try {
      if (!value) return [];

      let parsed = value;

      while (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // PDF Export
  const exportToPDF = async () => {
    try {
      const patientId = patient.patient_id;
      if (!patientId) {
        alert("Patient ID not found.");
        return;
      }

      const latestRecordRes = await axios.get(
        `http://localhost:5000/patientmedicalrecords/${patientId}/latest`
      );
      const latestRecord = latestRecordRes.data.latestRecord;

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow pop-ups to export PDF");
        return;
      }

      const age = calculateAge(patient.dateOfBirth);
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const medicalHistoryText =
        (Array.isArray(patient.patientHistory) &&
        patient.patientHistory.length > 0
          ? patient.patientHistory.join(", ")
          : "") +
        (patient.otherPatientConditions
          ? (Array.isArray(patient.patientHistory) &&
            patient.patientHistory.length > 0
              ? ", "
              : "") + patient.otherPatientConditions
          : "");

      const showVitals =
        !!patient.bp ||
        !!patient.rbs ||
        !!patient.fbs ||
        !!patient.visionLeft ||
        !!patient.visionRight;

      const v = (x, fallback = "—") =>
        x !== undefined && x !== null && String(x).trim() !== ""
          ? x
          : `<span class="muted">${fallback}</span>`;

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Medical Report - ${patient.name || "Patient"}</title>
<style>
@page { size: A4; margin: 12mm; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
:root {
--primary: #b91c1c;
--text: #111827;
--muted: #6b7280;
--border: #e5e7eb;
--subtle: #fafafa;
}
* { box-sizing: border-box; }
body { font-family: "Times New Roman", Times, serif; color: var(--text); background: #fff; line-height: 1.45; font-size: 11pt; margin: 0; padding: 0; }
.doc { width: 100%; }
#print-area { transform-origin: top left; }
.letterhead { padding-bottom: 8px; border-bottom: 1.5px solid var(--border); }
.brand-bar { height: 4px; width: 100%; background: var(--primary); margin-bottom: 10px; border-radius: 2px; }
.hospital-name { font-size: 18pt; font-weight: bold; letter-spacing: .5px; }
.hospital-subtitle { font-size: 10pt; color: var(--muted); font-style: italic; margin-top: 2px; }
.report-title { font-size: 14pt; font-weight: bold; color: var(--primary); text-align: center; margin: 12px 0 12px; letter-spacing: .5px; text-transform: uppercase; }
.cards-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cards-1col { display: grid; grid-template-columns: 1fr; gap: 10px; }
.card { border: 1px solid var(--border); border-radius: 8px; background: #fff; padding: 10px 12px; }
.card-title { display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
.mark { width: 6px; height: 16px; background: var(--primary); border-radius: 3px; }
.row { display: flex; margin-bottom: 4px; }
.label { width: 170px; font-weight: 700; }
.value { flex: 1; }
.muted { color: var(--muted); }
table { width: 100%; border-collapse: collapse; }
.metrics td { padding: 6px 0; border-bottom: 1px dotted var(--border); vertical-align: top; font-size: 10.5pt; }
.metrics tr:last-child td { border-bottom: none; }
.metrics td:first-child { width: 42%; font-weight: 700; padding-right: 10px; }
.metrics td:nth-child(3) { width: 26%; font-weight: 700; padding-left: 16px; padding-right: 10px; }
.chip { display: inline-block; padding: 2px 8px; border-radius: 999px; font-weight: 700; font-size: 10pt; border: 1px solid var(--border); }
.chip.active { color: #15803d; border-color: #bbf7d0; background: #f0fdf4; }
.chip.inactive { color: #b91c1c; border-color: #fecaca; background: #fef2f2; }
.chip.treatment { color: #1d4ed8; border-color: #bfdbfe; background: #eff6ff; }
.footer { margin-top: 12px; border-top: 1px solid var(--border); padding-top: 8px; }
.signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 12px; }
.sig-box { text-align: center; font-size: 10pt; }
.sig-line { border-bottom: 1px solid #000; height: 26px; margin-bottom: 6px; }
.disclaimer { margin-top: 8px; font-size: 9pt; color: var(--muted); background: var(--subtle); padding: 8px; border: 1px solid var(--border); text-align: center; }
.meta { text-align: center; font-size: 9pt; color: var(--muted); margin-top: 6px; }
</style>
<script>
(function() {
function mmToPx(mm) { return Math.round(mm * 3.7795275591); }
function fitToOnePage() {
var area = document.getElementById('print-area');
if (!area) return;
var availableHeightPx = mmToPx(297 - (12 * 2));
var areaHeight = area.scrollHeight;
var scale = Math.min(1, availableHeightPx / areaHeight);
area.style.transform = 'scale(' + scale + ')';
area.style.width = (100 / scale) + '%';
}
window.addEventListener('load', function() {
setTimeout(function() {
fitToOnePage();
setTimeout(function() {
window.focus();
window.print();
setTimeout(function(){ window.close(); }, 300);
}, 120);
}, 40);
});
})();
</script>
</head>
<body>
<div class="doc" id="print-area">
<div class="letterhead">
<div class="brand-bar"></div>
<div class="hospital-name">MEDICAL CENTER - CPSTL</div>
<div class="hospital-subtitle">Comprehensive Healthcare Services</div>
</div>

      <div class="report-title">Medical Examination Report</div>

      <div class="cards-2col">
        <div class="card">
          <div class="card-title"><span class="mark"></span>Patient Overview</div>
          <div class="row"><div class="label">Patient Name</div><div class="value">${v(
            patient.name
          )}</div></div>
          <div class="row"><div class="label">Registration No.</div><div class="value">${v(
            patient.registrationNo
          )}</div></div>
          <div class="row"><div class="label">EPF No.</div><div class="value">${v(
            patient.epfNo
          )}</div></div>
          <div class="row"><div class="label">Status</div>
            <div class="value">
              <span class="chip ${
                patient.status === "Deactivate"
                  ? "inactive"
                  : patient.status === "In treatment"
                  ? "treatment"
                  : "active"
              }">${v(patient.status || "Active")}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-title"><span class="mark"></span>Demographics</div>
          <div class="row"><div class="label">Date of Birth</div><div class="value">${
            patient.dateOfBirth
              ? new Date(patient.dateOfBirth).toLocaleDateString()
              : '<span class="muted">—</span>'
          }</div></div>
          <div class="row"><div class="label">Age</div><div class="value">${
            age ? age + " years" : '<span class="muted">—</span>'
          }</div></div>
          <div class="row"><div class="label">Gender</div><div class="value">${v(
            patient.gender
          )}</div></div>
          <div class="row"><div class="label">Contact No.</div><div class="value">${v(
            patient.contactNo
          )}</div></div>
        </div>
      </div>

      <div class="cards-2col" style="margin-top:10px;">
        <div class="card">
          <div class="card-title"><span class="mark"></span>Physical Measurements</div>
          <table class="metrics">
            <tr>
              <td>Height</td><td>${
                patient.height
                  ? patient.height + " cm"
                  : '<span class="muted">Not recorded</span>'
              }</td>
              <td>Weight</td><td>${
                patient.weight
                  ? patient.weight + " kg"
                  : '<span class="muted">Not recorded</span>'
              }</td>
            </tr>
            <tr>
              <td>Body Mass Index (BMI)</td><td>${
                patient.bmi || '<span class="muted">Not calculated</span>'
              }</td>
              <td>Waist Circumference</td><td>${
                patient.waist
                  ? patient.waist + " cm"
                  : '<span class="muted">Not recorded</span>'
              }</td>
            </tr>
          </table>
        </div>

        ${
          showVitals
            ? `
          <div class="card">
            <div class="card-title"><span class="mark"></span>Vitals & Laboratory</div>
            <table class="metrics">
              ${
                patient.bp
                  ? `<tr><td>Blood Pressure</td><td colspan="3">${patient.bp} mmHg</td></tr>`
                  : ""
              }
              ${
                patient.rbs || patient.fbs
                  ? `
                <tr>
                  <td>${patient.rbs ? "Random Blood Sugar (RBS)" : ""}</td>
                  <td>${patient.rbs ? patient.rbs + " mg/dL" : ""}</td>
                  <td>${patient.fbs ? "Fasting Blood Sugar (FBS)" : ""}</td>
                  <td>${patient.fbs ? patient.fbs + " mg/dL" : ""}</td>
                </tr>`
                  : ""
              }
              ${
                patient.visionLeft || patient.visionRight
                  ? `
                <tr>
                  <td>${patient.visionLeft ? "Vision (Left Eye)" : ""}</td>
                  <td>${patient.visionLeft ? patient.visionLeft : ""}</td>
                  <td>${patient.visionRight ? "Vision (Right Eye)" : ""}</td>
                  <td>${patient.visionRight ? patient.visionRight : ""}</td>
                </tr>`
                  : ""
              }
            </table>
          </div>`
            : `
          <div class="card">
            <div class="card-title"><span class="mark"></span>Vitals & Laboratory</div>
            <div class="muted">No recent vitals or lab values recorded.</div>
          </div>`
        }
      </div>

      <div class="cards-1col" style="margin-top:10px;">
        <div class="card">
          <div class="card-title"><span class="mark"></span>Medical History</div>
          <div>${
            medicalHistoryText && medicalHistoryText.trim().length > 0
              ? medicalHistoryText
              : '<span class="muted">No significant medical history reported.</span>'
          }</div>
        </div>

        ${
          patient.currentProblems
            ? `
          <div class="card">
            <div class="card-title"><span class="mark"></span>Current Health Problems</div>
            <div>${patient.currentProblems}</div>
          </div>
        `
            : ""
        }

        ${
          patient.treatmentPlan
            ? `
          <div class="card">
            <div class="card-title"><span class="mark"></span>Treatment Plan & Recommendations</div>
            <div>${patient.treatmentPlan}</div>
          </div>
        `
            : ""
        }
      </div>

      <div class="footer">
        <div class="signature-grid">
          <div class="sig-box">
            <div class="sig-line"></div>
            Examining Physician
            <div style="margin-top:6px; font-size: 9.5pt;">
              Name: _______________<br/>
              Date: ${currentDate}
            </div>
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            Medical Center Doctor
            <div style="margin-top:6px; font-size: 9.5pt;">
              Name: _______________<br/>
              Date: ${currentDate}
            </div>
          </div>
        </div>

        <div class="disclaimer">
          CONFIDENTIAL MEDICAL DOCUMENT — For authorized use only. Unauthorized distribution is prohibited.
        </div>
        <div class="meta">
          <strong>Report Ref:</strong> ${
            patient.registrationNo || "REG"
          }-${Date.now()} |
          <strong>Generated:</strong> ${currentDate}
        </div>
      </div>
    </div>
  </body>
</html>
`;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        alert("PDF generated successfully!");
      }, 500);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Calculate age once here
  const age = calculateAge(patient.dateOfBirth);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <EyeIcon className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">View Patient Details</h2>
                <p className="text-red-100 text-sm">
                  {patient.name} - {patient.registrationNo}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="p-2 hover:bg-red-700 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {/* Demographics */}
          <div className="mb-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <UserCircleIcon className="w-6 h-6 mr-2 text-blue-600" />
              Patient Demographics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Registration No.</p>
                <p className="font-semibold text-gray-900">
                  {patient.registrationNo || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-semibold text-gray-900">
                  {patient.name || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">EPF No.</p>
                <p className="font-semibold text-gray-900">
                  {patient.epfNo || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact No.</p>
                <p className="font-semibold text-gray-900">
                  {patient.contactNo || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-semibold text-gray-900">
                  {patient.gender || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-semibold text-gray-900">
                  {patient.dateOfBirth
                    ? new Date(patient.dateOfBirth).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-semibold text-gray-900">
                  {age ? `${age} years` : "—"}
                </p>
              </div>
            </div>
          </div>
          {/* Health Metrics */}
          <div className="mb-6 bg-orange-50 rounded-xl p-6 border border-orange-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <HeartIcon className="w-6 h-6 mr-2 text-red-500" />
              Health Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500">Height</p>
                <p className="font-semibold text-gray-900">
                  {patient.height ? `${patient.height} cm` : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Weight</p>
                <p className="font-semibold text-gray-900">
                  {patient.weight ? `${patient.weight} kg` : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">BMI</p>
                <p className="font-semibold text-gray-900">
                  {patient.bmi || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Waist</p>
                <p className="font-semibold text-gray-900">
                  {patient.waist ? `${patient.waist} cm` : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="mb-6 bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <BeakerIcon className="w-5 h-5 mr-2 text-purple-600" />
              Vital Signs & Lab Results
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div>
                <p className="text-sm text-gray-500">Blood Pressure</p>
                <p className="font-semibold text-gray-900">
                  {patient.bp || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">RBS</p>
                <p className="font-semibold text-gray-900">
                  {patient.rbs || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">FBS</p>
                <p className="font-semibold text-gray-900">
                  {patient.fbs || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vision (Left)</p>
                <p className="font-semibold text-gray-900">
                  {patient.visionLeft || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vision (Right)</p>
                <p className="font-semibold text-gray-900">
                  {patient.visionRight || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="mb-6 bg-yellow-50 rounded-xl p-6 border border-yellow-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-yellow-600" />
              Medical History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-yellow-200 rounded-lg text-sm">
                <thead className="bg-yellow-100 text-gray-700">
                  <tr>
                    <th className="p-2 text-left font-semibold">Category</th>
                    <th className="p-2 text-left font-semibold">Conditions</th>
                    <th className="p-2 text-left font-semibold">Other</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-200">
                  {/* Patient */}
                  <tr>
                    <td className="p-2 font-medium text-gray-600">Patient</td>
                    <td className="p-2 text-gray-900">
                      {(() => {
                        const arr = normalizeToArray(patient.patientHistory);
                        return arr.length > 0 ? arr.join(", ") : "—";
                      })()}
                    </td>
                    <td className="p-2 text-gray-700">
                      {patient.otherPatientConditions || "—"}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2 font-medium text-gray-600">Father</td>
                    <td className="p-2 text-gray-900">
                      {(() => {
                        const arr = normalizeToArray(
                          patient.familyHistoryFather
                        );
                        return arr.length > 0 ? arr.join(", ") : "—";
                      })()}
                    </td>
                    <td className="p-2 text-gray-700">
                      {patient.otherFatherConditions || "—"}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2 font-medium text-gray-600">Mother</td>
                    <td className="p-2 text-gray-900">
                      {(() => {
                        const arr = normalizeToArray(
                          patient.familyHistoryMother
                        );
                        return arr.length > 0 ? arr.join(", ") : "—";
                      })()}
                    </td>
                    <td className="p-2 text-gray-700">
                      {patient.otherMotherConditions || "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-gray-600">Siblings</td>
                    <td className="p-2 text-gray-900">
                      {(() => {
                        const arr = normalizeToArray(
                          patient.familyHistorySiblings
                        );
                        return arr.length > 0 ? arr.join(", ") : "—";
                      })()}
                    </td>
                    <td className="p-2 text-gray-700">
                      {patient.otherSiblingsConditions || "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Lifestyle & Habits */}
          <div className="mb-6 bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <SunIcon className="w-5 h-5 mr-2 text-green-600" />
              Lifestyle & Habits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Alcohol Consumption
                </p>
                <p className="font-semibold text-gray-900 whitespace-pre-line">
                  {patient.alcoholConsumption || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Smoking Habits
                </p>
                <p className="font-semibold text-gray-900 whitespace-pre-line">
                  {patient.smokingHabits || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Current Problems  */}
          <div className="mb-6 bg-red-50 rounded-xl p-6 border border-red-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-600" />
              Current Problems
            </h3>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Current Issues & Symptoms
              </p>
              <p className="font-semibold text-gray-900 whitespace-pre-line">
                {patient.currentProblems || "—"}
              </p>
            </div>
          </div>

          {/* Screening Tests */}
          <div className="mb-6 bg-indigo-50 rounded-xl p-6 border border-indigo-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <BeakerIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Screening Tests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Breast Examination
                </p>
                <p className="font-semibold text-gray-900">
                  {patient.breastExamination || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Pap Smear</p>
                <p className="font-semibold text-gray-900">
                  {patient.papSmear || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Treatment Plan  */}
          <div className="mb-6 bg-teal-50 rounded-xl p-6 border border-teal-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2 text-teal-600" />
              Treatment Plan & Recommendations
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Treatment Plan
                </p>
                <p className="font-semibold text-gray-900 whitespace-pre-line">
                  {patient.treatmentPlan || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Smoking Cessation Advice
                </p>
                <p className="font-semibold text-gray-900 whitespace-pre-line">
                  {patient.smokingCessationAdvice || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Alcohol Abuse Advice
                </p>
                <p className="font-semibold text-gray-900 whitespace-pre-line">
                  {patient.alcoholAbuseAdvice || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <div className="text-sm text-gray-500">View patient information</div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
            <button
              onClick={exportToPDF}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewPatientModal;
