const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db");
const JWT_SECRET = process.env.JWT_SECRET;

// Admin login
module.exports = {
  adminLogin: (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error("Admin login error:", err);
        return res
          .status(500)
          .json({ message: "Server error", error: err.message });
      }

      if (!results || results.length === 0) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }

      const admin = results[0];

      bcrypt.compare(password, admin.password, (err, isMatch) => {
        if (err) {
          console.error("Password compare error:", err);
          return res
            .status(500)
            .json({ message: "Server error", error: err.message });
        }

        if (!isMatch)
          return res
            .status(400)
            .json({ message: "Invalid username or password" });

        const token = jwt.sign({ id: admin.id, role: "admin" }, JWT_SECRET, {
          expiresIn: "1d",
        });
        res.json({
          message: "Login successful",
          role: "admin",
          token,
          user: {
            id: admin.id,
            username: admin.username,
            name: admin.name,
            profile_image: admin.profile_image,
          },
        });
      });
    });
  },

  // Get admin by ID
  getAdminById: (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (!results || results.length === 0)
        return res.status(404).json({ message: "Admin not found" });

      res.json(results[0]);
    });
  },
};
