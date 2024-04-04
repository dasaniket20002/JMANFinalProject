require("dotenv").config();

const User = require("../../schemas/User");
const Project = require("../../schemas/Project");
const FeedbackQuestion = require("../../schemas/FeedbackQuestion");

const GetAllUsersController = async (req, res) => {
  try {
    const usersRaw = await User.find().exec();
    const users = usersRaw.map((user) => {
      return { name: user.name, email: user.email, role: user.role };
    });
    return res.status(200).json({ users: users });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
};

const GetAllProjectsController = async (req, res) => {
  try {
    const projectsRaw = await Project.find().exec();
    const projects = projectsRaw.map((item) => ({
      _id: item._id,
      name: item.name,
      question_ids: item.question_ids,
      users: item.users,
    }));
    return res.status(200).json({ projects: projects });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
};

const GetAllFeedbackQuestionsController = async (req, res) => {
  try {
    const feedbackQuestionsRaw = await FeedbackQuestion.find().exec();
    const feedbackQuestions = feedbackQuestionsRaw.map((item) => ({
      _id: item._id,
      question: item.question,
    }));
    return res.status(200).json({ feedbackQuestions: feedbackQuestions });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
};

const GetOwnProjectsController = async (req, res) => {
  try {
    const projectsRaw = await Project.find().exec();
    const projects = projectsRaw
      .map((item) => ({
        _id: item._id,
        name: item.name,
        question_ids: item.question_ids,
        users: item.users,
      }))
      .filter((item) => item.users.includes(req.decoded.email));
    return res.status(200).json({ projects: projects });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
};

module.exports = {
  GetOwnProjectsController,
  GetAllFeedbackQuestionsController,
  GetAllProjectsController,
  GetAllUsersController,
};
