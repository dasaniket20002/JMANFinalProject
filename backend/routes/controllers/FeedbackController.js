const FeedbackAnswer = require("../../schemas/FeedbackAnswer");

const FeedbackUploadController = async (req, res) => {
  try {
    const { projectFeedbackAnswers, dateStart, dateEnd } = req.body;

    const foundFeedback = await FeedbackAnswer.findOne({
      email: req.decoded.email,
      dateStart,
      dateEnd,
    });
    if (foundFeedback) {
      foundFeedback.projectFeedbackAnswers = projectFeedbackAnswers;

      await foundFeedback.save();
      return res.status(200).json({ msg: "Feedback updated successfully" });
    }

    const newFeedback = new FeedbackAnswer({
      projectFeedbackAnswers,
      email: req.decoded.email,
      dateStart,
      dateEnd,
    });
    await newFeedback.save();

    return res.status(200).json({ msg: "Feedback saved succesfully" });
  } catch (error) {
    console.err(error);
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
};

const GetOwnFeedbacksController = async (req, res) => {
  try {
    const { dateStart, dateEnd } = req.body;
    const foundFeedback = await FeedbackAnswer.findOne({
      email: req.decoded.email,
      dateStart,
      dateEnd,
    });
    if (!foundFeedback)
      return res.status(202).json({ err: "No feedbacks for the current user" });

    return res.status(200).json({ feedback: foundFeedback });
  } catch (error) {
    console.err(error);
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
};

module.exports = {
  FeedbackUploadController,
  GetOwnFeedbacksController,
};
