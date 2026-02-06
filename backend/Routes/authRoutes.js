const express = require("express");
const router = express.Router();
const {  register,changePassword } = require("../Controllers/authController");
const patientAuth = require("../Controllers/patientAuthController");
const adminAuth = require("../Controllers/adminAuthController");
const authMiddleware = require("../Middleware/authMiddleware");

// Patient Login
router.post("/patient/login", patientAuth.patientLogin);

// Get patient by ID
router.get("/patient/:id", patientAuth.getPatientById);

// Get staff by ID
router.get("/staff/:id", patientAuth.getStaffById);

// Admin Login
router.post("/admin/login", adminAuth.adminLogin);

// Get admin by ID
router.get("/admin/:id", adminAuth.getAdminById);

//user register route
router.post("/register", register);

//change password
router.put("/change-password", authMiddleware.protect, changePassword);


module.exports = router;
