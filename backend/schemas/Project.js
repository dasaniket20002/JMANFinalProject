const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  question_ids: {
    type: [String],
    default: [],
  },
  users: {
    type: [String],
    default: [],
  },
});

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
