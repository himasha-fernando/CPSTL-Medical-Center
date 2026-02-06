const patientModel = require("../Models/patientModel");
const bcrypt = require("bcrypt");
const ExcelJS = require("exceljs");

// Create new patient
const createPatient = async (req, res) => {
  try {
    const patientData = { ...req.body };

    if (patientData.password) {
      patientData.password = await bcrypt.hash(patientData.password, 10);
    }

    patientModel.addPatient(patientData, (err, result) => {
      if (err) return res.status(500).json({ error: err });

      res.json({
        message: "Patient added successfully",
        patientId: result.insertId,
      });
    });
  } catch (err) {
    console.error("Create patient error:", err);
    res.status(500).json({ message: "Server error" });
  }
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
// Get next registration number
const getNextRegistrationNo = (req, res) => {
  patientModel.getLastRegistrationNo((err, lastRegNo) => {
    if (err) {
      console.error("Error fetching last registrationNo:", err);
      return res.status(500).json({ error: "Server error" });
    }

    let nextRegNo = "REG001"; // default if no patients
    if (lastRegNo) {
      const lastNo = parseInt(lastRegNo.replace(/\D/g, "")); // extract number
      const nextNo = lastNo + 1;
      nextRegNo = "REG" + String(nextNo).padStart(3, "0");
    }

    res.json({ registrationNo: nextRegNo });
  });
};

// Download absent patients
const downloadAbsentPatientsExcel = async (req, res) => {
  const { department } = req.params;

  patientModel.getAbsentPatientsByDepartment(department, async (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "DB error" });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Absent Patients");

    sheet.columns = [
      { header: "Registration No", key: "registrationNo", width: 18 },
      { header: "Name", key: "name", width: 25 },
      { header: "EPF No", key: "epfNo", width: 15 },
      { header: "Department", key: "department", width: 25 },
      { header: "Contact No", key: "contactNo", width: 15 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Date of Birth", key: "dateOfBirth", width: 15 },
    ];

    rows.forEach((r) => sheet.addRow(r));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Absent_${department}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  });
};

// Get absent patients by department
const getAbsentPatientsByDepartmentJSON = (req, res) => {
  const department = decodeURIComponent(req.params.department).trim();

  patientModel.getAbsentPatientsByDepartment(department, (err, results) => {
    if (err) {
      console.error("Error fetching absent patients:", err);
      return res.status(500).json({ message: "Server error" });
    }

    return res.json(results);
  });
};

// Department wise patient count
const getPatientCountDepartmentWise = (req, res) => {
  patientModel.getPatientCountByDepartment((err, results) => {
    if (err) {
      console.error("Error fetching department patient counts:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }

    res.json({ success: true, data: results });
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
  getNextRegistrationNo,
  downloadAbsentPatientsExcel,
  getAbsentPatientsByDepartmentJSON,
  getPatientCountDepartmentWise,
};
