const express = require("express");
const authorize = require("./middlewares/authorizationByRole");
const {
  FeedbackUploadController,
  GetOwnFeedbacksController,
  GetUserFeedbackController,
} = require("./controllers/FeedbackController");
const router = express.Router();

router.post("/upload", authorize, FeedbackUploadController);

router.post("/getOwnFeedbacks", authorize, GetOwnFeedbacksController);

router.post("/getUserFeedback", authorize, GetUserFeedbackController);

module.exports = router;
