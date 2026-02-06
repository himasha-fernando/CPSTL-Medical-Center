const db = require("../db");
const util = require("util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const query = util.promisify(db.query).bind(db);

// Login User
async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing username or password" });
    }

    const rows = await query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (!rows || rows.length === 0) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid username or password" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid username or password" });
    }

    const token = jwt.sign(
  {
    id: user.id,
    username: user.username,
    role: "admin", 
  },
  JWT_SECRET,
  { expiresIn: "1h" },
);

    return res.json({
      status: "success",
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        profile_image: user.profile_image,
        name: user.name,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Server error", error: err.message });
  }
}

// Register
async function register(req, res) {
  try {
    const { username, password, profile_image, name } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing username or password" });
    }

    // check exists
    const existing = await query("SELECT id FROM users WHERE username = ?", [
      username,
    ]);
    if (existing && existing.length > 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Username already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await query(
      "INSERT INTO users (username, password, profile_image,name) VALUES (?, ?, ?, ?)",
      [username, hashed, profile_image, name || null],
    );

    return res.json({
      status: "success",
      message: "User registered",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Server error", error: err.message });
  }
}

// Change Password
async function changePassword(req, res) {
  try {
    const { userType, identifier, newPassword } = req.body;
    const loggedInUser = req.user; 

    if (!userType || !identifier || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    }

    
    //admin can change any password
    if (loggedInUser.role === "admin") {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      if (userType === "admin") {
        await query("UPDATE users SET password=? WHERE username=?", [
          hashedPassword,
          identifier,
        ]);
      } else if (userType === "patient") {
        await query("UPDATE patients SET password=? WHERE epfNo=?", [
          hashedPassword,
          identifier,
        ]);
      } else {
        return res.status(400).json({
          status: "error",
          message: "Invalid user type",
        });
      }

      return res.json({
        status: "success",
        message: "Password updated by admin",
      });
    }

    
    //patient can change ONLY own password
    
    if (loggedInUser.role === "patient") {
      if (userType !== "patient" || loggedInUser.epfNo !== identifier) {
        return res.status(403).json({
          status: "error",
          message: "Not allowed",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await query("UPDATE patients SET password=? WHERE epfNo=?", [
        hashedPassword,
        identifier,
      ]);

      return res.json({
        status: "success",
        message: "Password updated",
      });
    }

    return res.status(403).json({
      status: "error",
      message: "Unauthorized",
    });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
}


module.exports = {
  login,
  register,
  changePassword,
};
