const express = require("express");
const authorize = require("./middlewares/authorizationByRole");
const {
  TimesheetUploadController,
} = require("./controllers/TimesheetControllers");
const router = express.Router();

router.post("/upload", authorize, TimesheetUploadController);

module.exports = router;
