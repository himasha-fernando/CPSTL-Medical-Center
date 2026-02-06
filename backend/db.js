/* const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root",
  database: "myapp",
  dateStrings: true,
});

db.connect((err) => {
  if (err) console.log("DB connection failed:", err);
  else console.log("Connected to MySQL");
});

module.exports = db; */

const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Root",
  database: "myapp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+05:30",
  dateStrings: true,
});

db.on("error", (err) => {
  console.error("MySQL Pool Error:", err);
});

db.getConnection((err, conn) => {
  if (err) {
    console.error("DB pool connection failed:", err);
  } else {
    console.log("Connected to MySQL (POOL)");
    conn.release();
  }
});

module.exports = db;
