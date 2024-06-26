const express = require("express");
const {
  ChangePasswordController,
  WhoIsTryingToChangePasswordController,
} = require("./controllers/ChangePasswordControllers");
const router = express.Router();

// CHANGE PASSWORD ROUTE
// requires params {q} to be present
// post with {new_pass, cnf_pass}
router.post("/", ChangePasswordController);

// GET EMAIL OF USER WHO IS ASKING TO CHANGE PASSWORD
// params {q} that contains the random id generated by forgotpass path
router.get("/getLinkedEmail", WhoIsTryingToChangePasswordController);

module.exports = router;
