const mongoose = require('mongoose');

const FeedbackAnswerSchema = new mongoose.Schema({
    projectIds: {
        type: [String],
        required: true,
    },
    feedbackQuestionIds: {
        type: [[String]],
        required: true,
    },
    checkedAnswers: {
        type: [[String]],
        required: true,
    },
    textAnswers: {
        type: [[String]],
        default: [],
    },
    email: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: [[Date]],
        default: [],
    }
});

const FeedbackAnswer = mongoose.model('FeedbackAnswer', FeedbackAnswerSchema);
module.exports = FeedbackAnswer;