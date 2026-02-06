const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const patientModel = require("../Models/patientModel");
const staffModel = require("../models/staffModel");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  // Patient ,Staff login
  patientLogin: (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing username or password" });
    }

    // Check PATIENT
    patientModel.findByEpfNo(username, async (err, patient) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      if (patient) {
        // bcrypt password check
        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
          return res
            .status(400)
            .json({ message: "Invalid username or password" });
        }

        const token = jwt.sign(
          { id: patient.id, role: "patient", username: patient.epfNo },
          JWT_SECRET,
          { expiresIn: "1d" },
        );

        return res.json({
          message: "Login successful",
          role: "patient",
          token,
          user: {
            id: patient.id,
            name: patient.name,
            epfNo: patient.epfNo,
            department: patient.department,
            contactNo: patient.contactNo,
            dateOfBirth: patient.dateOfBirth,
            phone: patient.phone,
            profile_image: patient.profile_image || null,
          },
        });
      }

      // Check STAFF (password NOT sent to model)
      staffModel.findByUsername(username, async (err, staff) => {
        if (err) {
          return res.status(500).json({ message: "Server error" });
        }

        if (!staff) {
          return res
            .status(400)
            .json({ message: "Invalid username or password" });
        }

        // bcrypt password check
        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
          return res
            .status(400)
            .json({ message: "Invalid username or password" });
        }

        const token = jwt.sign(
          { id: staff.id, role: "staff", username: staff.name },
          JWT_SECRET,
          { expiresIn: "1d" },
        );

        return res.json({
          message: "Login successful",
          role: "staff",
          token,
          user: {
            id: staff.id,
            name: staff.name,
            epfNumber: staff.epfNumber,
            designation: staff.designation,
            experience: staff.experience,
            phone: staff.contactNo,
            primarySpecialization: staff.primarySpecialization,
            secondarySpecialization: staff.secondarySpecialization,
            medicalLicenseNumber: staff.medicalLicenseNumber,
            licenseExpiryDate: staff.licenseExpiryDate,
            qualifications: staff.qualifications,
            profile_image: staff.profileImage || null,
          },
        });
      });
    });
  },

  // Get patient by ID
  getPatientById: (req, res) => {
    const id = req.params.id;
    patientModel.getPatientById(id, (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (!results || results.length === 0)
        return res.status(404).json({ message: "Patient not found" });

      res.json(results[0]);
    });
  },

  // Get staff by ID
  getStaffById: (req, res) => {
    const id = req.params.id;

    staffModel.getStaffById(id, (err, results) => {
      if (err) {
        console.error("Error fetching staff:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({ message: "Staff not found" });
      }

      res.json(results[0]);
    });
  },
};
