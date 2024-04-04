require("dotenv").config();

const Project = require("../../schemas/Project");

const AddProjectController = async (req, res) => {
  try {
    const { project_name } = req.body;
    if (!project_name || project_name === "")
      return res.status(202).json({ err: "All Fields are Required" });

    const project = await Project.findOne({ name: project_name });
    if (project) return res.status(202).json({ err: "Project already exists" });

    const newProject = new Project({ name: project_name });
    await newProject.save();

    return res.status(200).json({ msg: "Project Added" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
  // const TASK_PERFORMED = "CREATE_PROJECTS";
  // try {
  //   const { project_name } = req.body;
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
  //       if (!authLevels) return res.status(202).json({ err: "Role not Found" });

  //       if (authLevels.access_to.includes(TASK_PERFORMED)) {
  //         if (!project_name || project_name === "")
  //           return res.status(202).json({ err: "All Fields are Required" });

  //         const project = await Project.findOne({ name: project_name });
  //         if (project)
  //           return res.status(202).json({ err: "Project already exists" });

  //         const newProject = new Project({ name: project_name });
  //         await newProject.save();

  //         return res.status(200).json({ msg: "Project Added" });
  //       } else {
  //         return res.status(400).json({ err: "Authorization error" });
  //       }
  //     }
  //   });
  // } catch (error) {
  //   return res.status(500).json({ msg: "Internal Error", err: error });
  // }
};

module.exports = AddProjectController;
