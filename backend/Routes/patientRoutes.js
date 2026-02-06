const express = require("express");
const db = require("../db")
const router = express.Router();
const {
  createPatient,
  getNextRegistrationNo,
  getAllPatients,
  getPatientById,
  deletePatient,
  getPatientCount,
  checkPatient,
  getAbsentPatientCountByDepartment,
  searchPatient,
  checkEPF,
  downloadAbsentPatientsExcel,
  getAbsentPatientsByDepartmentJSON,
  getPatientCountDepartmentWise
} = require("../Controllers/patientController");


// Add new patient
router.post("/add", createPatient);

//generate Reg no
router.get("/next-registration",getNextRegistrationNo);

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

//Absent patient list
router.get("/absentPatients/:department",getAbsentPatientsByDepartmentJSON);

// Download absent patients
router.get("/absentPatients/excel/:department",downloadAbsentPatientsExcel);

// Get patient by id
router.get("/:id", getPatientById);

// Delete patient
router.delete("/delete/:id", deletePatient);

// Department-wise patient count
router.get("/count/department-wise", getPatientCountDepartmentWise);

module.exports = router;
