const FeedbackAnswer = require("../../schemas/FeedbackAnswer");

const FeedbackUploadController = async (req, res) => {
    try {
        const { projectIds, feedbackQuestionIds, checkedAnswers, textAnswers } = req.body;

        const foundFeedback = await FeedbackAnswer.findOne({ email: req.decoded.email });
        if (foundFeedback) {
            foundFeedback.projectIds = projectIds;
            foundFeedback.feedbackQuestionIds = feedbackQuestionIds;
            foundFeedback.checkedAnswers = checkedAnswers;
            foundFeedback.textAnswers = textAnswers;
            // foundFeedback.uploadedAt = Date.now();

            await foundFeedback.save();
            return res.status(200).json({ msg: "Feedback updated successfully" });
        }

        const newFeedback = new FeedbackAnswer({
            projectIds, feedbackQuestionIds, checkedAnswers, textAnswers, email: req.decoded.email
        });
        await newFeedback.save();

        return res.status(200).json({ msg: "Feedback saved succesfully" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Internal Error", err: error });
    }
}

module.exports = {
    FeedbackUploadController,
}