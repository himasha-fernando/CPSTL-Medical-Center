const express = require("express");
const db = require("../db")
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
  getYearlyPatientStats
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
router.get("/:patientId/latest",getLatestMedicalRecordByPatientId);

// Get all visit history for patient (for charts)
router.get("/:patientId/history", getPatientHistory);

// Fetch monthly metrics for a patient
router.get("/:patientId/monthly", getPatientMonthlyMetrics);

// Fetch yearly metrics for a patient
router.get("/:patientId/yearly", getPatientYearlyMetrics);

// Fetch count of records for a patient
router.get("/count/:patientId", (req, res) => {
  const { patientId } = req.params;
  const sql = "SELECT COUNT(*) AS count FROM patientmedicalrecords WHERE patient_id = ?";
  db.query(sql, [patientId], (err, result) => {
    if (err) {
      console.error("Error fetching record count:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    res.json({ success: true, count: result[0].count });
  });
});

module.exports = router;
                               