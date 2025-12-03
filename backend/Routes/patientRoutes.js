const express = require("express");
const db = require("../db")
const router = express.Router();
const {
  createPatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  getPatientCount,
  checkPatient,
  getAbsentPatientCountByDepartment,
  searchPatient,
  checkEPF
} = require("../Controllers/patientController");


// Add new patient
router.post("/add", createPatient);

// Get all patients
router.get("/", getAllPatients);

// Get patient count
router.get("/count", getPatientCount);

// Check if patient exists
router.get("/check",checkPatient);

// Get absent patient count
router.get("/absentCount", getAbsentPatientCountByDepartment);

// Check EPF exists
router.get("/check-epf/:epfNo", checkEPF);

//search patient by REG or EPF
router.get("/search", searchPatient);

// Get patient by id
router.get("/:id", getPatientById);

// Delete patient
router.delete("/delete/:id", deletePatient);

module.exports = router;
