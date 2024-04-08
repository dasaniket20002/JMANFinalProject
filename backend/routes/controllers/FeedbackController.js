const FeedbackAnswer = require("../../schemas/FeedbackAnswer");

const FeedbackUploadController = async (req, res) => {
  try {
    const { projectFeedbackAnswers, dateStart, dateEnd } = req.body;

    if (
      projectFeedbackAnswers.every((projectFeedbackAnswer) =>
        projectFeedbackAnswer.checkedAnswers.every(
          (checkedAnswer) => checkedAnswer === ""
        )
      )
    )
      return res.status(202).json({ err: "Atleast one rating must be given" });

    if (!dateStart || !dateEnd)
      return res.status(202).json({ err: "dates not passed" });

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
    if (!dateStart || !dateEnd)
      return res.status(202).json({ err: "dates not passed" });

    const foundFeedback = await FeedbackAnswer.findOne({
      email: req.decoded.email,
      dateStart,
      dateEnd,
    });
    if (!foundFeedback)
      return res.status(202).json({ err: "No feedbacks for the current user" });

    return res.status(200).json({ feedback: foundFeedback });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
};

module.exports = {
  FeedbackUploadController,
  GetOwnFeedbacksController,
};
