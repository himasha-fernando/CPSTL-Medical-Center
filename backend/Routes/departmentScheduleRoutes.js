const express = require("express");
const router = express.Router();
const {
  saveSchedule,
  getLastScheduleDate,
  getLatestSchedule,
  getAllLatestSchedules,
  autoUpdatePastSchedule,
  deleteSchedule,
  updateSchedule,
  getLatestScheduleDates
} = require("../Controllers/departmentScheduleController");

// Get last schedule date by department
router.get("/last/:department", getLastScheduleDate);

//Get latest schedule date by department
router.get("/latest/:department",getLatestSchedule);

//Get all
router.get("/latest-all",getAllLatestSchedules)

//auto update schedule after 6 months
router.post("/auto-update",autoUpdatePastSchedule);

//Delete schedule
router.delete("/:id", deleteSchedule);

//update schedule
router.put("/:id", updateSchedule);

// check medical dates
router.get("/schedule-dates/:department", getLatestScheduleDates);

// Save new schedule 
router.post("/", saveSchedule);

module.exports = router;
