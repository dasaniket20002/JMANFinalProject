const express = require("express");
const router = express.Router();

const authorize = require("./middlewares/authorizationByRole");
const {
  GetAllUsersController,
  GetAllProjectsController,
  GetOwnProjectsController,
  GetAllFeedbackQuestionsController,
  GetOwnFeedbackQuestionsController,
} = require("./controllers/GetAllDetailsControllers");
const {
  DecodeJWTController,
  GetAllPermissionsController,
  AssignPermissionsController,
} = require("./controllers/AuthorizationControllers");
require("dotenv").config();

// DECODES RECIEVED JWT
// recieves {token} from params
router.get("/decodeJWT", DecodeJWTController);

router.get("/getPermissions", GetAllPermissionsController);

// GET ALL USERS
// must have headers as { 'Auth':role + " " + jwt }
// returns list of all users from database
router.get("/getAllUsers", authorize, GetAllUsersController);

// GET ALL PROJECTS
// must have headers as { 'Auth':role + " " + jwt }
// returns list of all projects from database
router.get("/getAllProjects", authorize, GetAllProjectsController);

// GET OWN PROJECTS
// must have headers as { 'Auth':role + " " + jwt }
// returns list of own projects from database
router.get("/getOwnProjects", authorize, GetOwnProjectsController);

// GET ALL FEEDBACK QUESTIONS
// must have headers as { 'Auth':role + " " + jwt }
// returns list of all feedback questions from database
router.get(
  "/getAllFeedbackQuestions",
  authorize,
  GetAllFeedbackQuestionsController
);

// GET OWN FEEDBACK QUESTIONS
// must have headers as { 'Auth':role + " " + jwt }
// returns list of own feedback questions from database
router.get(
  "/getOwnFeedbackQuestions",
  authorize,
  GetOwnFeedbackQuestionsController
);

router.post("/updatePermissions", authorize, AssignPermissionsController);

module.exports = router;
