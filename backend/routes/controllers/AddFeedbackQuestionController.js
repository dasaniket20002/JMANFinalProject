require("dotenv").config();

const Project = require("../../schemas/Project");
const FeedbackQuestion = require("../../schemas/FeedbackQuestion");

const AddFeedbackQuestionController = async (req, res) => {
  try {
    const { project_name, question } = req.body;
    if (!project_name || !question || project_name === "" || question === "")
      return res.status(202).json({ err: "All Fields are Required" });

    const project = await Project.findOne({ name: project_name });
    if (!project) return res.status(202).json({ err: "Project not found" });

    const feedbackQuestionFound = await FeedbackQuestion.findOne({
      question: question,
    });
    if (feedbackQuestionFound) {
      if (project.question_ids.includes(feedbackQuestionFound._id))
        return res.status(202).json({ err: "Question already exists" });

      project.question_ids = [
        ...project.question_ids,
        feedbackQuestionFound._id,
      ];
      await project.save();

      return res.status(200).json({ msg: "Feedback Question Added" });
    } else {
      const feedbackQuestion = new FeedbackQuestion({
        question: question,
      });
      await feedbackQuestion.save();

      if (project.question_ids.includes(feedbackQuestion._id))
        return res.status(202).json({ err: "Question already exists" });

      project.question_ids = [...project.question_ids, feedbackQuestion._id];
      await project.save();

      return res.status(200).json({ msg: "Feedback Question Added" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
  // const TASK_PERFORMED = "CREATE_QUESTIONS";
  // try {
  //   const { project_name, question } = req.body;
  //   const auth_header = req.headers["auth"].split(" ");

  //   const authLevels = await AuthLevels.findOne({ role: auth_header[0] });
  //   if (!authLevels) return res.status(202).json({ err: "Role not Found" });

  //   if (!authLevels.access_to.includes(TASK_PERFORMED))
  //     return res.status(400).json({ err: "Authorization error" });

  //   if (!auth_header[1])
  //     return res.status(400).json({ err: "Authorization error" });

  //   jwt.verify(auth_header[1], process.env.JWT_SECRET, async (err, decoded) => {
  //     if (err) {
  //       return res.status(400).json({ err: "Authorization error" });
  //     } else {
  //       const authLevels = await AuthLevels.findOne({ role: decoded.role });
  //       if (!authLevels) return res.status(202).json({ err: "Role not Found" });

  //       if (authLevels.access_to.includes(TASK_PERFORMED)) {
  //         if (
  //           !project_name ||
  //           !question ||
  //           project_name === "" ||
  //           question === ""
  //         )
  //           return res.status(202).json({ err: "All Fields are Required" });

  //         const project = await Project.findOne({ name: project_name });
  //         if (!project)
  //           return res.status(202).json({ err: "Project not found" });

  //         const feedbackQuestionFound = await FeedbackQuestion.findOne({
  //           question: question,
  //         });
  //         if (feedbackQuestionFound) {
  //           if (project.question_ids.includes(feedbackQuestionFound._id))
  //             return res.status(202).json({ err: "Question already exists" });

  //           project.question_ids = [
  //             ...project.question_ids,
  //             feedbackQuestionFound._id,
  //           ];
  //           await project.save();

  //           return res.status(200).json({ msg: "Feedback Question Added" });
  //         } else {
  //           const feedbackQuestion = new FeedbackQuestion({
  //             question: question,
  //           });
  //           await feedbackQuestion.save();

  //           if (project.question_ids.includes(feedbackQuestion._id))
  //             return res.status(202).json({ err: "Question already exists" });

  //           project.question_ids = [
  //             ...project.question_ids,
  //             feedbackQuestion._id,
  //           ];
  //           await project.save();

  //           return res.status(200).json({ msg: "Feedback Question Added" });
  //         }
  //       } else {
  //         return res.status(400).json({ err: "Authorization error" });
  //       }
  //     }
  //   });
  // } catch (error) {
  //   return res.status(500).json({ msg: "Internal Error", err: error });
  // }
};

module.exports = AddFeedbackQuestionController;
