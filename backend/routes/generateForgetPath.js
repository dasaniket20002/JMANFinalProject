const express = require("express");
const {
  GenerateForgetPasswordController,
} = require("./controllers/ChangePasswordControllers");
const router = express.Router();
require("dotenv").config();

// GENERATE FORGET PASSWORD ROUTE
// post with {email}
router.post("/", GenerateForgetPasswordController);

module.exports = router;
