require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const patientRoutes = require("./Routes/patientRoutes");
const addUser = require("./Controllers/authController");
const patientMedicalRecordsRoutes = require("./Routes/patientMedicalRecordsRoutes");
const staffRoutes = require("./Routes/staffRoutes");
const authRoutes = require("./Routes/authRoutes");
const departmentScheduleRoutes = require("./Routes/departmentScheduleRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Patient routes
app.use("/patients", patientRoutes);

//medical records routes
app.use("/patientmedicalrecords", patientMedicalRecordsRoutes);

//staff routes
app.use("/staff", staffRoutes);

//auth routes
app.use("/auth", authRoutes);

//schedule routes
app.use("/api/schedules", departmentScheduleRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

/* app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/dist/index.html")
  );a
}); */

// Start server
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
