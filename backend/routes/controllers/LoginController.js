require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../schemas/User");
const { JWT_EXPIRY_TIME } = require("../../utils/consts");

const LoginController = async (req, res) => {
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
      expiresIn: JWT_EXPIRY_TIME,
    });
    return res.status(200).json({ msg: "User found", jwt: jwt_token });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
};

module.exports = LoginController;
