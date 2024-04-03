const mongoose = require('mongoose');

const FeedbackQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
});

const FeedbackQuestion = mongoose.model('FeedbackQuestion', FeedbackQuestionSchema);
module.exports = FeedbackQuestion;