const db = require("../db");

const Admin = {
  //create admin
  create: (adminData, callback) => {
    const sql = `
      INSERT INTO users 
      (username, password, profile_image, name)
      VALUES (?, ?, ?, ?)
    `;

    const params = [
      adminData.username,
      adminData.password, 
      adminData.profile_image || null,
      adminData.name,
    ];

    db.query(sql, params, callback);
  },

//get all admins
  getAll: (callback) => {
    const sql = "SELECT id, username, profile_image, name FROM users";
    db.query(sql, callback);
  },

  //get admin by id
  getById: (id, callback) => {
    const sql = "SELECT id, username, profile_image, name FROM users WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  //get admin by username
  findByUsername: (username, callback) => {
    const sql = "SELECT * FROM users WHERE username = ? LIMIT 1";
    db.query(sql, [username], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  //update admin by id
  updateById: (id, adminData, callback) => {
    const sql = `
      UPDATE users SET
        username = ?,
        profile_image = ?,
        name = ?
      WHERE id = ?
    `;

    const params = [
      adminData.username,
      adminData.profile_image || null,
      adminData.name,
      id,
    ];

    db.query(sql, params, callback);
  },

 //update password by username
  updatePasswordByUsername: (username, hashedPassword, callback) => {
    const sql = "UPDATE users SET password = ? WHERE username = ?";
    db.query(sql, [hashedPassword, username], callback);
  },

 //delete admin by id
  deleteById: (id, callback) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  },

  //get admin count
  getCount: (callback) => {
    const sql = "SELECT COUNT(*) AS count FROM users";
    db.query(sql, callback);
  },
};

module.exports = Admin;
