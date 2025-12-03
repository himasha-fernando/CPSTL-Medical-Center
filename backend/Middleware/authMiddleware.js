const jwt = require("jsonwebtoken");

module.exports = {
  protect: (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Not authorized" });

    try {
      const decoded = jwt.verify(token, "SECRETKEY123");
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  },

  adminOnly: (req, res, next) => {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admins only" });

    next();
  },

  patientOnly: (req, res, next) => {
    if (req.user.role !== "patient")
      return res.status(403).json({ message: "Patients only" });

    next();
  },
};
