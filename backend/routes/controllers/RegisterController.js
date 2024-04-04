require("dotenv").config();
const bcrypt = require("bcrypt");

const User = require("../../schemas/User");

const RegisterController = async (req, res) => {
  try {
    const { name, email, pass, created_by, role } = req.body;

    if (req.decoded.email !== created_by)
      return res.status(400).json({ err: "Authorization error" });

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
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }

  // const TASK_PERFORMED = "REGISTER_USER";
  // try {
  //   const { name, email, pass, created_by, role } = req.body;
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
  //       if (!authLevels)
  //         return res.status(202).json({ err: "Role not Found" });

  //       if (
  //         authLevels.access_to.includes(TASK_PERFORMED) &&
  //         decoded.email === created_by
  //       ) {
  //         if (
  //           !name ||
  //           !email ||
  //           !pass ||
  //           !role ||
  //           name === "" ||
  //           email === "" ||
  //           pass === "" ||
  //           role === ""
  //         )
  //           return res.status(202).json({ err: "All Fields are Required" });

  //         const admin = await User.findOne({ email: created_by });
  //         if (!admin || admin.role !== "admin")
  //           return res.status(400).json({ err: "Authorization error" });

  //         const user = await User.findOne({ email: email });
  //         if (user) return res.status(202).json({ err: "User Already Exists" });

  //         const salt = await bcrypt.genSalt();
  //         console.log(pass, salt);
  //         const passwordHash = await bcrypt.hash(pass, salt);
  //         const new_user = new User({
  //           name,
  //           email,
  //           pass: passwordHash,
  //           created_by,
  //           role,
  //         });
  //         await new_user.save();

  //         return res.status(200).json({ msg: "User Created Successfully" });
  //       } else {
  //         return res.status(400).json({ err: "Authorization error" });
  //       }
  //     }
  //   });
  // } catch (error) {
  //   return res.status(500).json({ msg: "Internal Error", err: error });
  // }
};

module.exports = RegisterController;
