require("dotenv").config();
const { GET_TASK_PERFORMED } = require("../../utils/consts");
const jwt = require("jsonwebtoken");
const AuthLevels = require("../../schemas/AuthLevels");

const authorize = async (req, res, next) => {
    const TASK_PERFORMED = GET_TASK_PERFORMED(req);
    try {
        const auth_header = req.headers["auth"].split(" ");

        const authLevels = await AuthLevels.findOne({ role: auth_header[0] });
        if (!authLevels) return res.status(202).json({ err: "Role not Found" });

        if (!authLevels.access_to.includes(TASK_PERFORMED))
            return res.status(400).json({ err: "Authorization error" });

        if (!auth_header[1])
            return res.status(400).json({ err: "Authorization error" });

        const decoded = jwt.verify(auth_header[1], process.env.JWT_SECRET);
        if (!decoded)
            return res.status(400).json({ err: "Authorization error" });

        const decodedAuthLevels = await AuthLevels.findOne({ role: decoded.role });
        if (!decodedAuthLevels)
            return res.status(202).json({ err: "Role not Found" });

        if (!decodedAuthLevels.access_to.includes(TASK_PERFORMED))
            return res.status(400).json({ err: "Authorization error" });

        req.decoded = decoded;

    } catch (error) {
        return res.status(500).json({ msg: "Internal Error", err: error });
    }
    next();
}

module.exports = authorize;