const recordModel = require("../Models/patientMedicalRecordsModel");
const patientModel = require("../Models/patientModel");
const db = require("../db");

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
      latest.familyHistorySiblings ?? latest.familyHistorySibling,
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
          : r.visitDate?.slice(0, 7) === monthStr,
      );

      const data = {
        month: month.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
      };

      metrics.forEach(
        (m) => (data[m] = recordForMonth ? recordForMonth[m] : null),
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
          : new Date(r.visitDate).getFullYear() === year,
      );

      const latestRecord = yearRecords.sort(
        (a, b) => new Date(b.visitDate) - new Date(a.visitDate),
      )[0];

      const data = { year: year.toString() };
      metrics.forEach((m) => (data[m] = latestRecord ? latestRecord[m] : null));
      yearlyData.push(data);
    }

    res.json({ success: true, yearly: yearlyData });
  });
};

// GET today's medical records
const getTodayRecords = (req, res) => {
  recordModel.getTodayRecords((err, results) => {
    if (err) {
      console.error("Error fetching today's records:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch today's records",
      });
    }

    res.json({
      success: true,
      records: results,
    });
  });
};

//get all medical visit dates
const getAllVisitDates = (req, res) => {
  const sql = `
    SELECT patient_id, DATE(visitDate) AS visitDate
    FROM patientmedicalrecords
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Get dashboard high risk stats
const getDashboardHighRiskStats = (req, res) => {
  recordModel.getLatestMedicalStats((err, rows) => {
    if (err) {
      console.error("Dashboard risk error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    if (!rows || rows.length === 0) {
      return res.json({ data: [] });
    }

    // BMI
    const bmiCandidate = rows
      .filter((r) => r.bmi !== null)
      .reduce((max, r) => (r.bmi > max.bmi ? r : max));

    //BLOOD SUGAR (RBS / FBS logic)
    const sugarRows = rows
      .map((r) => ({
        ...r,
        sugarValue: Math.max(r.rbs || 0, r.fbs || 0),
      }))
      .filter((r) => r.sugarValue > 0);

    const sugarCandidate = sugarRows.reduce((max, r) =>
      r.sugarValue > max.sugarValue ? r : max,
    );

    // BLOOD PRESSURE
    const bpCandidate = rows
      .filter((r) => r.systolicBP >= 50 && r.diastolicBP >= 50)
      .map((r) => ({
        ...r,
        bpRisk: Math.max(r.systolicBP, r.diastolicBP),
      }))
      .reduce((max, r) => (r.bpRisk > max.bpRisk ? r : max));

    res.json({
      data: [
        {
          type: "BMI",
          name: bmiCandidate.name,
          epfNo: bmiCandidate.epfNo,
          department: bmiCandidate.department,
          value: bmiCandidate.bmi,
        },
        {
          type: "SUGAR",
          name: sugarCandidate.name,
          epfNo: sugarCandidate.epfNo,
          department: sugarCandidate.department,
          value: sugarCandidate.sugarValue,
        },
        {
          type: "BP",
          name: bpCandidate.name,
          epfNo: bpCandidate.epfNo,
          department: bpCandidate.department,
          value: `${bpCandidate.systolicBP}/${bpCandidate.diastolicBP}`,
        },
      ],
    });
  });
};

// Get daily stats
const getDailyPatientStats = (req, res) => {
  recordModel.getDailyPatientStats((err, results) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: results });
  });
};

// Get all patients with latest medical record
const getAllPatientsWithLatestRecord = (req, res) => {
  const sql = `
    SELECT 
      p.id,
      p.name,
      p.epfNo,
      p.department,
      p.gender,
      p.dateOfBirth,
      p.contactNo,

      m.id AS recordId,
      m.bmi,
      m.waist,
      m.systolicBP,
      m.diastolicBP,
      m.rbs,
      m.fbs,
      m.visionLeft,
      m.visionRight,
      m.visitDate AS visitDate

    FROM patients p
    INNER JOIN patientmedicalrecords m
      ON m.id = (
        SELECT pm.id
        FROM patientmedicalrecords pm
        WHERE pm.patient_id = p.id
        ORDER BY pm.visitDate DESC
        LIMIT 1
      )
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: err });
    }
    res.json(results);
  });
};

// Get HIGH-RISK patient COUNTS (all departments)
const getDashboardHighRiskCounts = (req, res) => {
  recordModel.getHighRiskPatientCounts((err, rows) => {
    if (err) {
      console.error("High-risk count error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    const row = rows[0] || {};

    res.json({
      data: {
        BMI: row.highBMI || 0,
        BP: row.highBP || 0,
        SUGAR: row.highSugar || 0,
      },
    });
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
  getDailyPatientStats,
  getPatientMonthlyMetrics,
  getPatientYearlyMetrics,
  getPatientHistory,
  getTodayRecords,
  getAllVisitDates,
  getDashboardHighRiskStats,
  getDashboardHighRiskCounts,
  getAllPatientsWithLatestRecord,
};
