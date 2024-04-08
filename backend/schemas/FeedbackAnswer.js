const mongoose = require("mongoose");



const FeedbackAnswerSchema = new mongoose.Schema({
  projectFeedbackAnswers: {
    type: Array,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dateStart: {
    type: String,
    required: true,
  },
  dateEnd: {
    type: String,
    required: true,
  },
  // uploadedAt: {
  //     type: [[Date]],
  //     default: [],
  // }
});

const FeedbackAnswer = mongoose.model("FeedbackAnswer", FeedbackAnswerSchema);
module.exports = FeedbackAnswer;
