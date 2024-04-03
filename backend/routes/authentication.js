const express = require("express");
const User = require("../schemas/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthLevels = require("../schemas/AuthLevels");
const Project = require("../schemas/Project");
const FeedbackQuestion = require("../schemas/FeedbackQuestion");
const router = express.Router();
require("dotenv").config();

// LOGIN ROUTE
// post with { email, pass }
router.post("/login", async (req, res) => {
  try {
    const { email, pass } = req.body;
    if (!email || !pass || email === "" || pass === "")
      return res.status(202).json({ err: "All Fields are Required" });

    const user = await User.findOne({ email: email });
    if (!user) return res.status(202).json({ err: "User does not Exist" });

    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) return res.status(202).json({ err: "Invalid credentials" });

    const userObj = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const jwt_token = jwt.sign(userObj, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({ msg: "User found", jwt: jwt_token });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
});

// REGISTER ROUTE
// post with { email, pass, created_by, role }
// must have headers as { 'Auth':role + " " + jwt } to respond, it should match 'admin '+admin's jwt
// and the created_by field is the admin's email (auth error if email is not admin's)
router.post("/register", async (req, res) => {
  const TASK_PERFORMED = "REGISTER_USER";
  try {
    const { name, email, pass, created_by, role } = req.body;
    const auth_header = req.headers["auth"].split(" ");

    const authLevels = await AuthLevels.findOne({ role: auth_header[0] });
    if (!authLevels) return res.status(202).json({ err: "Role not Found" });

    if (!authLevels.access_to.includes(TASK_PERFORMED))
      return res.status(400).json({ err: "Authorization error" });

    if (!auth_header[1])
      return res.status(400).json({ err: "Authorization error" });

    jwt.verify(auth_header[1], process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ err: "Authorization error" });
      } else {
        const authLevels = await AuthLevels.findOne({ role: decoded.role });
        if (!authLevels) return res.status(202).json({ err: "Role not Found" });

        if (
          authLevels.access_to.includes(TASK_PERFORMED) &&
          decoded.email === created_by
        ) {
          if (
            !name ||
            !email ||
            !pass ||
            !role ||
            name === "" ||
            email === "" ||
            pass === "" ||
            role === ""
          )
            return res.status(202).json({ err: "All Fields are Required" });

          const admin = await User.findOne({ email: created_by });
          if (!admin || admin.role !== "admin")
            return res.status(400).json({ err: "Authorization error" });

          const user = await User.findOne({ email: email });
          if (user) return res.status(202).json({ err: "User Already Exists" });

          const salt = await bcrypt.genSalt();
          console.log(pass, salt);
          const passwordHash = await bcrypt.hash(pass, salt);
          const new_user = new User({
            name,
            email,
            pass: passwordHash,
            created_by,
            role,
          });
          await new_user.save();

          return res.status(200).json({ msg: "User Created Successfully" });
        } else {
          return res.status(400).json({ err: "Authorization error" });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
});

// POST with {project_name, question}
// must have headers as { 'Auth':role + " " + jwt } to respond, it should match 'admin '+admin's jwt
// and the created_by field is the admin's email (auth error if email is not admin's)
router.post("/addFeedbackQuestion", async (req, res) => {
  const TASK_PERFORMED = "CREATE_QUESTIONS";
  try {
    const { project_name, question } = req.body;
    const auth_header = req.headers["auth"].split(" ");

    const authLevels = await AuthLevels.findOne({ role: auth_header[0] });
    if (!authLevels) return res.status(202).json({ err: "Role not Found" });

    if (!authLevels.access_to.includes(TASK_PERFORMED))
      return res.status(400).json({ err: "Authorization error" });

    if (!auth_header[1])
      return res.status(400).json({ err: "Authorization error" });

    jwt.verify(auth_header[1], process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ err: "Authorization error" });
      } else {
        const authLevels = await AuthLevels.findOne({ role: decoded.role });
        if (!authLevels) return res.status(202).json({ err: "Role not Found" });

        if (authLevels.access_to.includes(TASK_PERFORMED)) {
          if (
            !project_name ||
            !question ||
            project_name === "" ||
            question === ""
          )
            return res.status(202).json({ err: "All Fields are Required" });

          const project = await Project.findOne({ name: project_name });
          if (!project)
            return res.status(202).json({ err: "Project not found" });

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

            project.question_ids = [
              ...project.question_ids,
              feedbackQuestion._id,
            ];
            await project.save();

            return res.status(200).json({ msg: "Feedback Question Added" });
          }
        } else {
          return res.status(400).json({ err: "Authorization error" });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
});

// POST with {project_name}
// must have headers as { 'Auth':role + " " + jwt } to respond, it should match 'admin '+admin's jwt
// and the created_by field is the admin's email (auth error if email is not admin's)
router.post("/addProject", async (req, res) => {
  const TASK_PERFORMED = "CREATE_PROJECTS";
  try {
    const { project_name } = req.body;
    const auth_header = req.headers["auth"].split(" ");

    const authLevels = await AuthLevels.findOne({ role: auth_header[0] });
    if (!authLevels) return res.status(202).json({ err: "Role not Found" });

    if (!authLevels.access_to.includes(TASK_PERFORMED))
      return res.status(400).json({ err: "Authorization error" });

    if (!auth_header[1])
      return res.status(400).json({ err: "Authorization error" });

    jwt.verify(auth_header[1], process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ err: "Authorization error" });
      } else {
        const authLevels = await AuthLevels.findOne({ role: decoded.role });
        if (!authLevels) return res.status(202).json({ err: "Role not Found" });

        if (authLevels.access_to.includes(TASK_PERFORMED)) {
          if (!project_name || project_name === "")
            return res.status(202).json({ err: "All Fields are Required" });

          const project = await Project.findOne({ name: project_name });
          if (project)
            return res.status(202).json({ err: "Project already exists" });

          const newProject = new Project({ name: project_name });
          await newProject.save();

          return res.status(200).json({ msg: "Project Added" });
        } else {
          return res.status(400).json({ err: "Authorization error" });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
});

// POST with {project_name, user_email}
// must have headers as { 'Auth':role + " " + jwt } to respond, it should match 'admin '+admin's jwt
// and the created_by field is the admin's email (auth error if email is not admin's)
router.post("/assignProject", async (req, res) => {
  const TASK_PERFORMED = "ASSIGN_USER_TO_PROJECTS";
  try {
    const { project_name, user_email } = req.body;
    const auth_header = req.headers["auth"].split(" ");

    const authLevels = await AuthLevels.findOne({ role: auth_header[0] });
    if (!authLevels) return res.status(202).json({ err: "Role not Found" });

    if (!authLevels.access_to.includes(TASK_PERFORMED))
      return res.status(400).json({ err: "Authorization error" });

    if (!auth_header[1])
      return res.status(400).json({ err: "Authorization error" });

    jwt.verify(auth_header[1], process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ err: "Authorization error" });
      } else {
        const authLevels = await AuthLevels.findOne({ role: decoded.role });
        if (!authLevels) return res.status(202).json({ err: "Role not Found" });

        if (authLevels.access_to.includes(TASK_PERFORMED)) {
          if (
            !project_name ||
            project_name === "" ||
            !user_email ||
            user_email === ""
          )
            return res.status(202).json({ err: "All Fields are Required" });

          const user = await User.findOne({ email: user_email });
          if (!user) return res.status(202).json({ err: "User not found" });

          const project = await Project.findOne({ name: project_name });
          if (!project)
            return res.status(202).json({ err: "Project not found" });

          if (project.users.includes(user_email))
            return res.status(202).json({ err: "User already assigned" });

          project.users = [...project.users, user_email];
          await project.save();

          return res.status(200).json({ msg: "User Assigned" });
        } else {
          return res.status(400).json({ err: "Authorization error" });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
});

module.exports = router;
