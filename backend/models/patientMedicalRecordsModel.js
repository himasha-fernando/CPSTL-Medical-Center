const db = require("../db");

// Convert empty string to NULL
const toNullable = (value, isNumber = false) => {
  if (value === "" || value === undefined || value === null) return null;
  return isNumber ? Number(value) : value;
};

// Add medical record
const addMedicalRecord = (patientId, data, callback) => {
  const sql = `
    INSERT INTO patientmedicalrecords
    (patient_id,
      visitDate,
      age,
      height,
      weight,
      bmi,
      waist,
      rbs,
      fbs,
      systolicBP,
      diastolicBP,
      visionLeft,
      visionRight,
      breastExamination,
      papSmear,
      alcoholConsumption,
      alcoholSummary,
      smokingHabits,
      smokingSummary,
      treatmentPlan,
      smokingCessationAdvice,
      alcoholAbuseAdvice,
      patientHistory,
      otherPatientConditions,
      familyHistoryFather,
      otherFatherConditions,
      familyHistoryMother,
      otherMotherConditions,
      familyHistorySiblings,
      otherSiblingsConditions,
      currentProblems
   )  VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
`;

  // Convert empty string to NULL
  const values = [
    patientId,
    data.visitDate || new Date(),

    toNullable(data.age, true),
    toNullable(data.height, true),
    toNullable(data.weight, true),
    toNullable(data.bmi, true),
    toNullable(data.waist, true),
    toNullable(data.rbs, true),
    toNullable(data.fbs, true),
    toNullable(data.systolicBP, true),
    toNullable(data.diastolicBP, true),

    toNullable(data.visionLeft),
    toNullable(data.visionRight),
    toNullable(data.breastExamination),
    toNullable(data.papSmear),

    toNullable(data.alcoholConsumption),
    toNullable(data.alcoholSummary),
    toNullable(data.smokingHabits),
    toNullable(data.smokingSummary),

    toNullable(data.treatmentPlan),
    toNullable(data.smokingCessationAdvice),
    toNullable(data.alcoholAbuseAdvice),

    data.patientHistory ? JSON.stringify(data.patientHistory) : null,
    toNullable(data.otherPatientConditions),

    data.familyHistoryFather ? JSON.stringify(data.familyHistoryFather) : null,

    toNullable(data.otherFatherConditions),

    data.familyHistoryMother ? JSON.stringify(data.familyHistoryMother) : null,

    toNullable(data.otherMotherConditions),

    data.familyHistorySiblings
      ? JSON.stringify(data.familyHistorySiblings)
      : null,

    toNullable(data.otherSiblingsConditions),
    toNullable(data.currentProblems),
  ];
  db.query(sql, values, callback);
};

//get all medical records by patient id
const getMedicalRecordsByPatientId = (patientId, callback) => {
  const sql = `
    SELECT * FROM patientmedicalrecords
    WHERE patient_id = ?
    ORDER BY visitDate DESC
  `;
  db.query(sql, [patientId], callback);
};

//get all medical records
const getMedicalRecords = (callback) => {
  const sql = "SELECT * FROM patientmedicalrecords";
  db.query(sql, callback);
};

// Fetch latest medical record for a patient
const getLatestMedicalRecordByPatientId = (patientId, callback) => {
  const sql = `
     SELECT * 
    FROM patientmedicalrecords 
    WHERE patient_id = ? 
    ORDER BY visitDate DESC 
    LIMIT 1
  `;
  db.query(sql, [patientId], callback);
};

//get today patient count
const getTodayPatientCount = (callback) => {
  const sql = `
    SELECT COUNT(DISTINCT patient_id) AS count
    FROM patientmedicalrecords
    WHERE DATE(visitDate) = CURDATE()
  `;
  db.query(sql, callback);
};
// Monthly patient visit count (last 12 months)
const getMonthlyPatientStats = (callback) => {
  const sql = `
    SELECT 
      DATE_FORMAT(visitDate, '%b %Y') AS month, 
      COUNT(DISTINCT patient_id) AS count
    FROM patientmedicalrecords
    WHERE visitDate >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY month
    ORDER BY MIN(visitDate) ASC
  `;
  db.query(sql, callback);
};

// Yearly patient visit count (last 5 years)
const getYearlyPatientStats = (callback) => {
  const sql = `
    SELECT 
      YEAR(visitDate) AS year,
      COUNT(DISTINCT patient_id) AS count
    FROM patientmedicalrecords
    WHERE visitDate >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR)
    GROUP BY year
    ORDER BY year ASC
  `;
  db.query(sql, callback);
};

// Get today's medical records
const getTodayRecords = (callback) => {
  const sql = `
    SELECT *
    FROM patientmedicalrecords
    WHERE DATE(visitDate) = CURDATE()
  `;

  db.query(sql, callback);
};

// Get latest medical stats
const getLatestMedicalStats = (callback) => {
  const sql = `
    SELECT 
      p.name,
      p.epfNo,
      p.department,
      m.bmi,
      m.rbs,
      m.fbs,
      m.systolicBP,
      m.diastolicBP
    FROM patientmedicalrecords m
    JOIN patients p ON p.id = m.patient_id
    WHERE m.id IN (
      SELECT MAX(id)
      FROM patientmedicalrecords
      GROUP BY patient_id
    )
  `;
  db.query(sql, callback);
};

// Daily patient visit count (last 7 days)
const getDailyPatientStats = (callback) => {
  const sql = `
    SELECT 
      DATE(visitDate) AS day,
      COUNT(DISTINCT patient_id) AS count
    FROM patientmedicalrecords
    WHERE visitDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY day
    ORDER BY day ASC
  `;
  db.query(sql, callback);
};

// Count high-risk patients using LATEST medical record only
const getHighRiskPatientCounts = (callback) => {
  const sql = `
    SELECT
      SUM(CASE WHEN bmi >= 30 THEN 1 ELSE 0 END) AS highBMI,
      SUM(
        CASE 
          WHEN (systolicBP >= 140 OR diastolicBP >= 90) 
          THEN 1 ELSE 0 
        END
      ) AS highBP,
      SUM(
        CASE 
          WHEN (rbs >= 200 OR fbs >= 126) 
          THEN 1 ELSE 0 
        END
      ) AS highSugar
    FROM patientmedicalrecords pm
    INNER JOIN (
      SELECT patient_id, MAX(visitDate) AS latestDate
      FROM patientmedicalrecords
      GROUP BY patient_id
    ) latest
      ON pm.patient_id = latest.patient_id
     AND pm.visitDate = latest.latestDate
  `;

  db.query(sql, callback);
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
  getTodayRecords,
  getLatestMedicalStats,
  getHighRiskPatientCounts,
};
