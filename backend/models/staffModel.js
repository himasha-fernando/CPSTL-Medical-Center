//const { getUsers, getAllUsers } = require("../Controllers/staffController");
const db = require("../db");

const Staff = {
  //create staff
  create: (staffData, callback) => {
    const sql = `INSERT INTO staff 
      (id, epfNumber, name, designation, experience, gender, profileImage, contactNo, primarySpecialization, secondarySpecialization, medicalLicenseNumber, licenseExpiryDate, qualifications, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      staffData.id,
      staffData.epfNumber,
      staffData.name,
      staffData.designation,
      staffData.experience === "" ? null : parseInt(staffData.experience, 10),
      staffData.gender || "Male",
      staffData.profileImage || null,
      staffData.contactNo,
      staffData.primarySpecialization || null,
      staffData.secondarySpecialization || null,
      staffData.medicalLicenseNumber || null,
      staffData.licenseExpiryDate || null,
      staffData.qualifications || null,
      staffData.status || "Active",
    ];

    db.query(sql, params, callback);
  },
  //get all staff
  getAll: (callback) => {
    db.query("SELECT * FROM staff", callback);
  },
  //get staff by id
  getStaffById: (id, callback) => {
    db.query("SELECT * FROM staff WHERE id = ?", [id], callback);
  },
  //delete staff by id
  deleteById: (id, callback) => {
    db.query("DELETE FROM staff WHERE id = ?", [id], callback);
  },
  //update staff by id
  updateById: (id, staffData, callback) => {
    const sql = `UPDATE staff SET
    epfNumber = ?,
    name = ?,
    designation = ?,
    experience = ?,
    gender = ?,
    profileImage = ?,
    contactNo = ?,
    primarySpecialization = ?,
    secondarySpecialization = ?,
    medicalLicenseNumber = ?,
    licenseExpiryDate = ?,
    qualifications = ?,
    status = ?
    WHERE id = ?`;

    // Prepare the parameters
    const params = [
      staffData.epfNumber,
      staffData.name,
      staffData.designation,
      staffData.experience === "" ? null : parseInt(staffData.experience, 10),
      staffData.gender || "Male",
      staffData.profileImage || null,
      staffData.contactNo,
      staffData.primarySpecialization || null,
      staffData.secondarySpecialization || null,
      staffData.medicalLicenseNumber || null,
      staffData.licenseExpiryDate || null,
      staffData.qualifications || null,
      staffData.status || "Active",
      id,
    ];

    db.query(sql, params, callback);
  },
  //get staff count
  getCount: (callback) => {
    const sql = "SELECT COUNT(*) AS count FROM staff";
    db.query(sql, callback);
  },

  //get all users
  getAllUsers: (callback) => {
    const sql = "SELECT * FROM users";
    db.query(sql, callback);
  },

  //find user by username
  findByUsername: (username, callback) => {
    const sql = "SELECT * FROM users WHERE username = ? LIMIT 1";
    db.query(sql, [username], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  //find staff by name
  findByName: (name, callback) => {
    const sql = "SELECT * FROM staff WHERE name = ? LIMIT 1";
    db.query(sql, [name], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  //find staff by name and epf
  findByNameAndEpf: (name, epfNumber, callback) => {
    const sql =
      "SELECT * FROM staff WHERE TRIM(name) = TRIM(?) AND TRIM(epfNumber) = TRIM(?) LIMIT 1";
    db.query(sql, [name, epfNumber], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
};

module.exports = Staff;
