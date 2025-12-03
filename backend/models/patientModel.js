const db = require("../db");

// Convert empty string to NULL
const toNullable = (value, isNumber = false) => {
  if (value === "" || value === undefined || value === null) return null;
  return isNumber ? Number(value) : value;
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return null;
  const dt = new Date(dateStr);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const hh = String(dt.getHours()).padStart(2, "0");
  const min = String(dt.getMinutes()).padStart(2, "0");
  const ss = String(dt.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

// Add a new patient
const addPatient = (patientData, callback) => {
  const sql = `
    INSERT INTO patients 
    (registrationNo, name, epfNo, department, contactNo, gender, dateOfBirth, status)
    VALUES (?, ?, ?, ?, ?, ?,?, ?)
  `;

  const values = [
    toNullable(patientData.registrationNo),
    toNullable(patientData.name),
    toNullable(patientData.epfNo),
    toNullable(patientData.department),
    toNullable(patientData.contactNo),
    toNullable(patientData.gender),
    toNullable(patientData.dateOfBirth),
    toNullable(patientData.status || "active"),
  ];

  db.query(sql, values, callback);
};

// Get all patients
const getPatients = (callback) => {
  const sql = "SELECT * FROM patients ORDER BY id DESC";
  db.query(sql, callback);
};

// Get patient by ID
const getPatientById = (id, callback) => {
  const sql = "SELECT * FROM patients WHERE id = ?";
  db.query(sql, [id], callback);
};

//delete patient by id
const deletePatient = (id, callback) => {
  const sql = "DELETE FROM patients WHERE id = ?";
  db.query(sql, [id], callback);
};

// Count patients
const getPatientCount = (callback) => {
  const sql = "SELECT COUNT(*) as count FROM patients";
  db.query(sql, callback);
};

// Check if patient exists
const checkPatient = (req, res) => {
  const { registrationNo } = req.query;

  if (!registrationNo) {
    return res.status(400).json({ message: "registrationNo is required" });
  }

  patientModel.checkPatientByRegistrationNo(registrationNo, (err, results) => {
    if (err) {
      console.error("Error checking patient:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      return res.json({ exists: true, patientId: results[0].id });
    } else {
      return res.json({ exists: false });
    }
  });
};

// Get absent patient count per department (no visit within 6 months)
const getAbsentPatientCountByDepartment = (callback) => {
  const sql = `
    SELECT 
      p.department,
      COUNT(p.id) AS absentCount
    FROM patients p
    LEFT JOIN (
      SELECT 
        patient_id, 
        MAX(visitDate) AS lastVisit
      FROM patientmedicalrecords
      GROUP BY patient_id
    ) m ON p.id = m.patient_id
    WHERE 
      (m.lastVisit IS NULL OR m.lastVisit < DATE_SUB(CURDATE(), INTERVAL 6 MONTH))
    GROUP BY p.department
  `;

  db.query(sql, callback);
};

// Check if patient exists by registrationNo
const checkPatientByRegistrationNo = (registrationNo, callback) => {
  const sql = "SELECT id FROM patients WHERE registrationNo = ?";
  db.query(sql, [registrationNo], callback);
};

const findPatientByField = (field, value, callback) => {
  const allowedFields = ["registrationNo", "epfNo"];
  if (!allowedFields.includes(field)) {
    return callback(new Error("Invalid field for search"));
  }

  //remove extra spaces
  const trimmedValue = value.trim();
  const sql = `SELECT * FROM patients WHERE TRIM(${field}) = ? LIMIT 1`;
  console.log("SQL Query:", sql, "Value:", trimmedValue);

  db.query(sql, [trimmedValue], callback);
};

const findByName = (name, callback) => {
  const sql = "SELECT * FROM patients WHERE name = ? LIMIT 1";
  db.query(sql, [name], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

const checkEPFExists = (epfNo, callback) => {
  const sql = "SELECT id FROM patients WHERE epfNo = ?";
  db.query(sql, [epfNo], callback);
};

module.exports = {
  addPatient,
  getPatients,
  getPatientById,
  deletePatient,
  getPatientCount,
  checkPatient,
  getAbsentPatientCountByDepartment,
  checkPatientByRegistrationNo,
  findPatientByField,
  findByName,
  checkEPFExists,
};
