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
  getAbsentPatientCountByDepartment
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

// Get patient by id
router.get("/:id", getPatientById);

// Delete patient
router.delete("/delete/:id", deletePatient);



module.exports = router;
