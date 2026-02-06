const Staff = require("../models/staffModel");

// Add new staff
const addStaff = (req, res) => {
  try {
    const staffData = req.body;

    // Validate request body
    if (!staffData || Object.keys(staffData).length === 0) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Create new staff record
    Staff.create(staffData, (err, result) => {
      if (err) {
        console.error("Error inserting staff:", err);
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Staff added successfully",
        staffId: staffData.id || result.insertId,
      });
    });
  } catch (error) {
    console.error("Unexpected error in addStaff:", error);
    res.status(500).json({ error: "Server error while adding staff" });
  }
};

// Get all staff
const getAllStaff = (req, res) => {
  Staff.getAll((err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};
// Get staff by ID
const getStaffById = (req, res) => {
  const { id } = req.params;
  Staff.getStaffById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "Staff not found" });
    res.json(result[0]);
  });
};
// Delete staff by ID
const deleteStaffById = (req, res) => {
  const { id } = req.params;
  Staff.deleteById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Staff deleted successfully" });
  });
};
// Update staff by ID
const updateStaffById = (req, res) => {
  const { id } = req.params;
  const staffData = req.body;

  Staff.updateById(id, staffData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Staff not found" });

    res.json({ message: "Staff updated successfully" });
  });
};
// Get count of staff
const getStaffCount = (req, res) => {
  Staff.getCount((err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: result[0].count });
  });
};

// Get all users
const getAllUsers = (req, res) => {
  Staff.getAllUsers((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

module.exports = {
  addStaff,
  getAllStaff,
  getStaffById,
  deleteStaffById,
  updateStaffById,
  getStaffCount,
  getAllUsers,
};
