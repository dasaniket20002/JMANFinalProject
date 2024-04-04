const mongoose = require("mongoose");

const TimesheetSchema = new mongoose.Schema({
  date_start: {
    type: String,
    required: true,
  },
  date_end: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  uploaded_at: {
    type: Date,
    default: Date.now(),
  },
  project_select_data: {
    type: Array,
    default: [[""], [""]],
  },
  task_select_data: {
    type: Array,
    default: [[""], [""]],
  },
  comment_data: {
    type: Array,
    default: [[""], [""]],
  },
  row_data: {
    type: Array,
    default: [[[0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0]]],
  },
  num_rows_per_activity: {
    type: [Number],
    required: true,
  },
  activity_names: {
    type: [String],
    required: true,
  },
});

const Timesheet = mongoose.model("Timesheet", TimesheetSchema);
module.exports = Timesheet;
