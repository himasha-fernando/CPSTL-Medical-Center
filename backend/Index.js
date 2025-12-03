const express = require("express");
const cors = require("cors");
const patientRoutes = require("./Routes/patientRoutes");
const addUser = require("./Controllers/authController");
const patientMedicalRecordsRoutes = require("./Routes/patientMedicalRecordsRoutes");
const staffRoutes = require("./Routes/staffRoutes");
const authRoutes = require("./Routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Patient routes
app.use("/patients", patientRoutes);

//medical records
app.use("/patientmedicalrecords", patientMedicalRecordsRoutes);

//staff routes
app.use("/staff", staffRoutes);

//auth routes
app.use("/auth", authRoutes);

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
