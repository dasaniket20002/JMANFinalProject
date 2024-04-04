const express = require("express");
const router = express.Router();

const authorize = require("./middlewares/authorizationByRole");
const LoginController = require("./controllers/LoginController");
const RegisterController = require("./controllers/RegisterController");
const AddFeedbackQuestionController = require("./controllers/AddFeedbackQuestionController");
const AddProjectController = require("./controllers/AddProjectController");
const AssignProjectController = require("./controllers/AssignProjectController");
require("dotenv").config();

// LOGIN ROUTE
// post with { email, pass }
router.post("/login", LoginController);

// REGISTER ROUTE
// post with { email, pass, created_by, role }
// must have headers as { 'Auth':role + " " + jwt } to respond, it should match 'admin '+admin's jwt
// and the created_by field is the admin's email (auth error if email is not admin's)
router.post("/register", authorize, RegisterController);

// POST with {project_name, question}
// must have headers as { 'Auth':role + " " + jwt } to respond, it should match 'admin '+admin's jwt
// and the created_by field is the admin's email (auth error if email is not admin's)
router.post("/addFeedbackQuestion", authorize, AddFeedbackQuestionController);

// POST with {project_name}
// must have headers as { 'Auth':role + " " + jwt } to respond, it should match 'admin '+admin's jwt
// and the created_by field is the admin's email (auth error if email is not admin's)
router.post("/addProject", authorize, AddProjectController);

// POST with {project_name, user_email}
// must have headers as { 'Auth':role + " " + jwt } to respond, it should match 'admin '+admin's jwt
// and the created_by field is the admin's email (auth error if email is not admin's)
router.post("/assignProject", authorize, AssignProjectController);

module.exports = router;
