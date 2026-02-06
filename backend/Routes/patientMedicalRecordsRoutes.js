const express = require("express");
const db = require("../db");
const router = express.Router();
const {
  addMedicalRecord,
  getMedicalRecords,
  getMedicalRecordsByPatientId,
  getLatestMedicalRecordByPatientId,
  getTodayPatientCount,
  getPatientMonthlyMetrics,
  getPatientYearlyMetrics,
  getPatientHistory,
  getMonthlyPatientStats,
  getYearlyPatientStats,
  getDailyPatientStats,
  getTodayRecords,
  getAllVisitDates,
  getDashboardHighRiskStats,
  getDashboardHighRiskCounts,
  getAllPatientsWithLatestRecord,
} = require("../Controllers/patientMedicalRecordsController");

// Get monthly patient stats
router.get("/stats/monthly", getMonthlyPatientStats);

// Get yearly patient stats
router.get("/stats/yearly", getYearlyPatientStats);

//Today's patient count
router.get("/records/today/count", getTodayPatientCount);

// Get all patients
router.get("/records", getMedicalRecords);

// Add new patient
router.post("/:patientId/records", addMedicalRecord);

// Get patient by ID all medical records
router.get("/:id/records", getMedicalRecordsByPatientId);

// Get patient with latest record
router.get("/:patientId/latest", getLatestMedicalRecordByPatientId);

// Get all visit history for patient (for charts)
router.get("/:patientId/history", getPatientHistory);

// Fetch monthly metrics for a patient
router.get("/:patientId/monthly", getPatientMonthlyMetrics);

// Fetch yearly metrics for a patient
router.get("/:patientId/yearly", getPatientYearlyMetrics);

// GET today's medical records
router.get("/stats/daily", getDailyPatientStats);

// GET today's checkout records
router.get("/records/today", getTodayRecords);

//get all visitdates
router.get("/records/all-dates", getAllVisitDates);

// Dashboard high risk stats
router.get("/dashboard/high-risk", getDashboardHighRiskStats);

// Dashboard high risk counts
router.get("/dashboard/high-risk-counts", getDashboardHighRiskCounts);

// Get all patients with latest medical record
router.get("/records/all-patients", getAllPatientsWithLatestRecord);

// Fetch count of records for a patient
router.get("/count/:patientId", (req, res) => {
  const { patientId } = req.params;
  const sql =
    "SELECT COUNT(*) AS count FROM patientmedicalrecords WHERE patient_id = ?";
  db.query(sql, [patientId], (err, result) => {
    if (err) {
      console.error("Error fetching record count:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    res.json({ success: true, count: result[0].count });
  });
});

// Get record by ID
router.get("/record/:recordId", (req, res) => {
  const { recordId } = req.params;

  const sql = `
    SELECT *
    FROM patientmedicalrecords
    WHERE id = ?
  `;

  db.query(sql, [recordId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "DB error" });
    }

    if (!results.length) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json(results[0]);
  });
});

module.exports = router;
