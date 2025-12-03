const patientModel = require("../Models/patientModel");

// Create new patient
const createPatient = (req, res) => {
  patientModel.addPatient(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({
      message: "Patient added successfully",
      patientId: result.insertId,
    });
  });
};

// Get all patients
const getAllPatients = (req, res) => {
  patientModel.getPatients((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get patient by ID
const getPatientById = (req, res) => {
  const id = req.params.id;
  patientModel.getPatientById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ message: "Patient not found" });
    res.json(results[0]);
  });
};

// Delete patient
const deletePatient = (req, res) => {
  const id = req.params.id;
  patientModel.deletePatient(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0) {
      // No patient with this ID
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  });
};

// Count patients
const getPatientCount = (req, res) => {
  patientModel.getPatientCount((err, results) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ count: results[0].count });
  });
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

// Get absent patient count per department (6+ months)
const getAbsentPatientCountByDepartment = (req, res) => {
  patientModel.getAbsentPatientCountByDepartment((err, results) => {
    if (err) {
      console.error("Error fetching absent patient count:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

// Search patient
const searchPatient = (req, res) => {
  const { registrationNo, epfNo } = req.query;

  const field = registrationNo ? "registrationNo" : epfNo ? "epfNo" : null;
  let value = registrationNo || epfNo;

  if (!field || !value) {
    return res.status(400).json({ message: "Provide registrationNo or epfNo" });
  }

  value = value.trim(); // trim spaces

  patientModel.findPatientByField(field, value, (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(results[0]);
  });
};

// Check if EPF exists
const checkEPF = (req, res) => {
  const epfNo = req.params.epfNo;

  if (!epfNo || epfNo.trim() === "") {
    return res.status(400).json({ message: "EPF No is required" });
  }

  patientModel.checkEPFExists(epfNo, (err, results) => {
    if (err) {
      console.error("Error checking EPF:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      return res.json({ exists: true, patientId: results[0].id });
    } else {
      return res.json({ exists: false });
    }
  });
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  getPatientCount,
  checkPatient,
  getAbsentPatientCountByDepartment,
  searchPatient,
  checkEPF,
};
