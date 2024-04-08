const express = require("express");
const authorize = require("./middlewares/authorizationByRole");
const {
  FeedbackUploadController,
  GetOwnFeedbacksController,
} = require("./controllers/FeedbackController");
const router = express.Router();

router.post("/upload", authorize, FeedbackUploadController);

router.post("/getOwnFeedbacks", authorize, GetOwnFeedbacksController);

module.exports = router;
