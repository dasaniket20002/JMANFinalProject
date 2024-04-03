const express = require("express");
const User = require("../schemas/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthLevels = require("../schemas/AuthLevels");
const Project = require("../schemas/Project");
const FeedbackQuestion = require("../schemas/FeedbackQuestion");
const router = express.Router();
const authorize = require('./middlewares/authorizationByRole');
require("dotenv").config();

// GET ALL USERS
// must have headers as { 'Auth':role + " " + jwt } to respond, it should match 'admin '+admin's jwt
// returns list of all users from database
router.get("/getAllUsers", authorize, async (req, res) => {
  try {
    const usersRaw = await User.find().exec();
    const users = usersRaw.map((user) => {
      return { name: user.name, email: user.email, role: user.role };
    });
    return res.status(200).json({ users: users });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
});

// DECODES RECIEVED JWT
// recieves {token} from params
router.get("/decodeJWT", async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(202).json({ err: "No JWT was passed" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(202).json({ err: err });
      } else {
        return res.status(200).json(decoded);
      }
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
});

router.get("/getPermissions", authorize, async (req, res) => {
  try {
    const role = req.decoded.role;
    const authLevels = await AuthLevels.findOne({ role: role });
    if (!authLevels) return res.status(202).json({ err: "Role not Found" });

    return res.status(200).json({ access_to: authLevels.access_to });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
});

// GET ALL PROJECTS
// must have headers as { 'Auth':role + " " + jwt } to respond, it should match 'admin '+admin's jwt
// returns list of all projects from database
router.get("/getAllProjects", authorize, async (req, res) => {
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
});

// GET OWN PROJECTS
// must have headers as { 'Auth':role + " " + jwt } to respond, it should match 'admin '+admin's jwt
// returns list of all projects from database
router.get("/getOwnProjects", async (req, res) => {
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
});

// GET ALL FEEDBACK QUESTIONS
// must have headers as { 'Auth':role + " " + jwt } to respond, it should match 'admin '+admin's jwt
// returns list of all feedback questions from database
router.get("/getAllFeedbackQuestions", async (req, res) => {
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
});

module.exports = router;
