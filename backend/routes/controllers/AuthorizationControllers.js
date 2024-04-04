require("dotenv").config();
const jwt = require("jsonwebtoken");
const AuthLevels = require("../../schemas/AuthLevels");

const DecodeJWTController = async (req, res) => {
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
};

const GetAllPermissionsController = async (req, res) => {
  try {
    const role = req.decoded.role;
    const authLevels = await AuthLevels.findOne({ role: role });
    if (!authLevels) return res.status(202).json({ err: "Role not Found" });

    return res.status(200).json({ access_to: authLevels.access_to });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
};

module.exports = {
  DecodeJWTController,
  GetAllPermissionsController,
};
