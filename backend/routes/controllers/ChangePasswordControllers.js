require("dotenv").config();
const bcrypt = require("bcrypt");
const RandomToUser = require("../../schemas/RandomToUser");
const User = require("../../schemas/User");
const send_email = require("../../utils/email");

const ChangePasswordController = async (req, res) => {
  try {
    const random_id = req.query.q;
    if (!random_id)
      return res.status(202).json({ err: "No Parameters Passed" });

    const latest_data = await RandomToUser.findOne({ random_id: random_id });

    if (!latest_data) return res.status(202).json({ err: "Invalid Link" });

    if (latest_data.expiry === 0)
      return res.status(202).json({ err: "Password already updated" });

    if (Date.now() - latest_data.time_created > latest_data.expiry)
      return res.status(202).json({ err: "Time Expired" });

    const { new_pass, cnf_pass } = req.body;
    if (!new_pass || !cnf_pass || new_pass === "" || cnf_pass === "")
      return res.status(202).json({ err: "All Fields Required" });

    if (new_pass !== cnf_pass)
      return res.status(202).json({ err: "Passwords do not match" });

    const salt = await bcrypt.genSalt();
    const pass_hash = await bcrypt.hash(new_pass, salt);

    const user = await User.findOne({ email: latest_data.email });
    if (!user) return res.status(204).json({ err: "User does not Exist" });

    user.pass = pass_hash;
    await user.save();

    latest_data.expiry = 0;
    await latest_data.save();

    return res.status(200).json({ msg: "Password Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ err: "Internal Error", error: error });
  }
};

const WhoIsTryingToChangePasswordController = async (req, res) => {
  try {
    const random_id = req.query.q;
    if (!random_id)
      return res.status(202).json({ err: "No Parameters Passed" });

    const latest_data = await RandomToUser.findOne({ random_id: random_id });

    if (!latest_data) return res.status(202).json({ err: "Invalid Link" });

    if (latest_data.expiry === 0)
      return res.status(202).json({ err: "Password already updated" });

    if (Date.now() - latest_data.time_created > latest_data.expiry)
      return res.status(202).json({ err: "Time Expired" });

    return res.status(200).json({ msg: latest_data.email });
  } catch (err) {
    return res.status(500).json({ err: "Internal Error", error: error });
  }
};

const GenerateForgetPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (email === "")
      return res.status(202).json({ err: "All Fields Required" });

    const user = await User.findOne({ email: email });
    if (!user) return res.status(202).json({ err: "User does not Exist" });

    const latest_data = (
      await RandomToUser.find({ email: email })
        .sort({ time_created: "desc" })
        .exec()
    ).at(0);

    let random_id;

    if (
      !latest_data ||
      Date.now() - latest_data.time_created > latest_data.expiry
    ) {
      do {
        random_id = crypto.randomUUID();
      } while (await RandomToUser.findOne({ random_id: random_id }));

      const new_entry = new RandomToUser({
        email: user.email,
        random_id: random_id,
      });
      await new_entry.save();
    } else {
      random_id = latest_data.random_id;
    }

    const data = {
      subject: "Update Your Password",
      body: `Go to this link to update your password: ${req.headers.referer}changepass?q=${random_id}`,
    };

    send_email(user.email, data)
      .then(() => {
        return res.status(200).json({ msg: "Please check your Email" });
      })
      .catch((error) => {
        return res.status(202).json({ err: "Cannot send Email", error: error });
      });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
};

module.exports = {
  GenerateForgetPasswordController,
  WhoIsTryingToChangePasswordController,
  ChangePasswordController,
};
