const express = require("express");
const authorize = require("./middlewares/authorizationByRole");
const {
  TimesheetUploadController, TimesheetFetchController, TimesheetFetchAllController,
} = require("./controllers/TimesheetControllers");
const router = express.Router();

router.post("/upload", authorize, TimesheetUploadController);

router.get("/fetchOwn", authorize, TimesheetFetchController);

router.post("/fetchAll", authorize, TimesheetFetchAllController);

module.exports = router;
