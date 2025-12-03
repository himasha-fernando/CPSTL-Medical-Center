const recordModel = require("../models/patientMedicalRecordsModel");
const patientModel = require("../Models/patientModel");

// Add medical record
const addMedicalRecord = (req, res) => {
  const patientId = req.params.patientId;
  recordModel.addMedicalRecord(patientId, req.body, (err, result) => {
    if (err) {
      console.error("Error inserting medical record:", err);
      return res.status(500).json({ success: false, error: err });
    }
    res.json({
      success: true,
      message: "Medical record added",
      recordId: result.insertId,
    });
  });
};

// Get all records for a patient
const getMedicalRecords = (req, res) => {
  recordModel.getMedicalRecords((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get medical records by patient ID
const getMedicalRecordsByPatientId = (req, res) => {
  const patientId = req.params.id;
  recordModel.getMedicalRecordsByPatientId(patientId, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    const parsedRecords = results.map((record) => ({
      ...record,
      patientHistory: record.patientHistory
        ? JSON.parse(record.patientHistory)
        : [],
      familyHistoryFather: record.familyHistoryFather
        ? JSON.parse(record.familyHistoryFather)
        : [],
      familyHistoryMother: record.familyHistoryMother
        ? JSON.parse(record.familyHistoryMother)
        : [],
      familyHistorySiblings: record.familyHistorySiblings
        ? JSON.parse(record.familyHistorySiblings)
        : [],
    }));

    res.json(parsedRecords);
  });
};

// Safe JSON parse
const safeParseJSON = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (err) {
    return [val];
  }
};

// Get latest medical record using patient_id
const getLatestMedicalRecordByPatientId = (req, res) => {
  const patientId = req.params.patientId;

  recordModel.getLatestMedicalRecordByPatientId(patientId, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "No medical record found for this patient" });
    }

    const latest = results[0];

    // Safely parse JSON fields
    latest.patientHistory = safeParseJSON(latest.patientHistory);
    latest.familyHistoryFather = safeParseJSON(latest.familyHistoryFather);
    latest.familyHistoryMother = safeParseJSON(latest.familyHistoryMother);
    latest.familyHistorySiblings = safeParseJSON(
      latest.familyHistorySiblings ?? latest.familyHistorySibling
    );

    res.json({
      success: true,
      latestRecord: latest,
    });
  });
};

// Get count of today's patients
const getTodayPatientCount = (req, res) => {
  recordModel.getTodayPatientCount((err, result) => {
    if (err) {
      console.error("Error fetching today's patient count:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ success: true, count: result[0].count });
  });
};
// Get monthly stats
const getMonthlyPatientStats = (req, res) => {
  recordModel.getMonthlyPatientStats((err, results) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: results });
  });
};

// Get yearly stats
const getYearlyPatientStats = (req, res) => {
  recordModel.getYearlyPatientStats((err, results) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: results });
  });
};
// Get full visit history
const getPatientHistory = (req, res) => {
  const patientId = req.params.patientId;

  recordModel.getMedicalRecordsByPatientId(patientId, (err, results) => {
    if (err) {
      console.error("Error fetching patient history:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Get monthly patient metrics for comparison
const getPatientMonthlyMetrics = (req, res) => {
  const patientId = req.params.patientId;

  recordModel.getMedicalRecordsByPatientId(patientId, (err, records) => {
    if (err) return res.status(500).json({ error: err.message });

    const monthlyData = [];
    const now = new Date();
    const metrics = ["weight", "height", "bmi", "waist", "bp", "rbs", "fbs"];

    for (let i = 11; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = month.toISOString().slice(0, 7);

      const recordForMonth = records.find((r) =>
        r.visitDate?.toISOString
          ? r.visitDate.toISOString().slice(0, 7) === monthStr
          : r.visitDate?.slice(0, 7) === monthStr
      );

      const data = {
        month: month.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
      };

      metrics.forEach(
        (m) => (data[m] = recordForMonth ? recordForMonth[m] : null)
      );
      monthlyData.push(data);
    }

    res.json({ success: true, monthly: monthlyData });
  });
};

// Get yearly patient metrics for comparison
const getPatientYearlyMetrics = (req, res) => {
  const patientId = req.params.patientId;

  recordModel.getMedicalRecordsByPatientId(patientId, (err, records) => {
    if (err) return res.status(500).json({ error: err.message });

    const yearlyData = [];
    const now = new Date();
    const metrics = ["weight", "height", "bmi", "waist", "bp", "rbs", "fbs"];

    for (let i = 4; i >= 0; i--) {
      const year = now.getFullYear() - i;
      const yearRecords = records.filter((r) =>
        r.visitDate?.getFullYear
          ? r.visitDate.getFullYear() === year
          : new Date(r.visitDate).getFullYear() === year
      );

      const latestRecord = yearRecords.sort(
        (a, b) => new Date(b.visitDate) - new Date(a.visitDate)
      )[0];

      const data = { year: year.toString() };
      metrics.forEach((m) => (data[m] = latestRecord ? latestRecord[m] : null));
      yearlyData.push(data);
    }

    res.json({ success: true, yearly: yearlyData });
  });
};

module.exports = {
  addMedicalRecord,
  getMedicalRecords,
  getMedicalRecordsByPatientId,
  getLatestMedicalRecordByPatientId,
  getTodayPatientCount,
  getMonthlyPatientStats,
  getYearlyPatientStats,
  getPatientMonthlyMetrics,
  getPatientYearlyMetrics,
  getPatientHistory,
};
