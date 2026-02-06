const db = require("../db");

// GET last schedule date for department
exports.getLastScheduleDate = (req, res) => {
  const department = req.params.department;
  const excludeId = req.query.excludeId;

  let sql = `
    SELECT MAX(batch_date) AS lastDate
    FROM departmentschedules
    WHERE department = ?
  `;
  const params = [department];

  if (excludeId) {
    sql += " AND id != ?";
    params.push(excludeId);
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      lastDate: result[0].lastDate || null,
    });
  });
};

// SAVE new schedule
exports.saveSchedule = (req, res) => {
  const { department, dates } = req.body;

  if (!department || !dates || dates.length !== 3) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const [date1, date2, date3] = dates;

  // batch_date - earliest date
  const batchDate = new Date(
    Math.min(...dates.map(d => new Date(d)))
  );

  const sql = `
    INSERT INTO departmentschedules
    (department, date_1, date_2, date_3, batch_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [department, date1, date2, date3, batchDate],
    (err, result) => {
      if (err) {
        console.error("MySQL ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({ message: "Schedule saved successfully" });
    }
  );
};


// GET latest 3 scheduled dates for department 
exports.getLatestSchedule = (req, res) => {
  const department = req.params.department;

  const sql = `
    SELECT date_1, date_2, date_3
    FROM departmentschedules
    WHERE department = ?
    ORDER BY batch_date DESC
    LIMIT 1
  `;

  db.query(sql, [department], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length === 0) return res.json([]);
    const dates = [rows[0].date_1, rows[0].date_2, rows[0].date_3];
    res.json(dates); // <--- returns array only
  });
};


// GET latest schedules for all departments
exports.getAllLatestSchedules = (req, res) => {
  const sql = `
    SELECT t1.id, t1.department, t1.date_1, t1.date_2, t1.date_3
    FROM departmentschedules t1
    INNER JOIN (
      SELECT department, MAX(batch_date) AS max_date
      FROM departmentschedules
      GROUP BY department
    ) t2 
      ON t1.department = t2.department 
     AND t1.batch_date = t2.max_date
    ORDER BY t1.department
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);

    res.json(
      rows.map(row => ({
        id: row.id,
        department: row.department,
        dates: [row.date_1, row.date_2, row.date_3],
      }))
    );
  });
};

// DELETE schedule
exports.deleteSchedule = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM departmentschedules WHERE id = ?",
    [id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Schedule deleted" });
    }
  );
};

// UPDATE schedule
exports.updateSchedule = (req, res) => {
  const { id } = req.params;
  const { dates } = req.body;

  if (!dates || dates.length !== 3) {
    return res.status(400).json({ message: "Invalid dates" });
  }

  const batchDate = new Date(Math.min(...dates.map(d => new Date(d))));

  db.query(
    `UPDATE departmentschedules
     SET date_1=?, date_2=?, date_3=?, batch_date=?
     WHERE id=?`,
    [dates[0], dates[1], dates[2], batchDate, id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Schedule updated" });
    }
  );
};

// AUTO UPDATE PAST SCHEDULE
exports.autoUpdatePastSchedule = (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sql = `
    SELECT t1.*
    FROM departmentschedules t1
    INNER JOIN (
      SELECT department, MAX(batch_date) AS max_date
      FROM departmentschedules
      GROUP BY department
    ) t2
    ON t1.department = t2.department
    AND t1.batch_date = t2.max_date
  `;

  db.query(sql, async (err, rows) => {
    if (err) return res.status(500).json(err);

    let inserted = 0;

    for (const row of rows) {
      const dates = [row.date_1, row.date_2, row.date_3];

      const allPast = dates.every(d => new Date(d) < today);
      if (!allPast) continue;

      // +6 months
      const newDates = dates.map(d => {
        const nd = new Date(d);
        nd.setMonth(nd.getMonth() + 6);
        return nd;
      });

      const batchDate = new Date(Math.min(...newDates));

      // Check if already exists
      const checkSql = `
        SELECT id FROM departmentschedules
        WHERE department = ? AND batch_date = ?
        LIMIT 1
      `;

      const exists = await new Promise(resolve => {
        db.query(checkSql, [row.department, batchDate], (e, r) => {
          resolve(r.length > 0);
        });
      });

      if (exists) continue;

      await new Promise(resolve => {
        db.query(
          `INSERT INTO departmentschedules
           (department, date_1, date_2, date_3, batch_date)
           VALUES (?, ?, ?, ?, ?)`,
          [row.department, newDates[0], newDates[1], newDates[2], batchDate],
          () => resolve()
        );
      });

      inserted++;
    }

    res.json({ message: "Auto update done", inserted });
  });
};



// GET latest scheduled 3 dates for a department
exports.getLatestScheduleDates = (req, res) => {
  const { department } = req.params;

  const sql = `
    SELECT date_1, date_2, date_3
    FROM departmentschedules
    WHERE department = ?
    ORDER BY batch_date DESC
    LIMIT 1
  `;

 db.query(sql, [department], (err, rows) => {
    if (err) return res.status(500).json({ success: false });
    if (rows.length === 0) return res.json({ success: true, dates: [] });
    const { date_1, date_2, date_3 } = rows[0];
    res.json({ success: true, dates: [date_1, date_2, date_3].filter(Boolean) });
  });
};








