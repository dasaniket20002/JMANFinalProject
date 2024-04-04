const Timesheet = require("../../schemas/Timesheet");

require("dotenv").config();

const TimesheetUploadController = async (req, res) => {
  try {
    const {
      date_start,
      date_end,
      project_select_data,
      task_select_data,
      comment_data,
      row_data,
      num_rows_per_activity,
      activity_names,
    } = req.body;

    if (activity_names.length !== num_rows_per_activity.length)
      return res.status(200).json({
        err: "number of rows per activity and activity list count does not match",
      });

    if (num_rows_per_activity.length === 0 || activity_names.length === 0)
      return res.status(200).json({ err: "no activities to save" });

    const rowDataDefaultValue = [
      [[0, 0, 0, 0, 0, 0, 0]],
      [[0, 0, 0, 0, 0, 0, 0]],
    ];
    const projectSelectDefaultValue = [[""], [""]];

    if (
      !date_start ||
      !date_end ||
      !project_select_data ||
      !task_select_data ||
      !comment_data ||
      !row_data ||
      !num_rows_per_activity ||
      !activity_names ||
      project_select_data.length === 0 ||
      task_select_data.length === 0 ||
      comment_data.length === 0 ||
      row_data.length === 0 ||
      date_start === "" ||
      date_end === "" ||
      JSON.stringify(project_select_data) ===
        JSON.stringify(projectSelectDefaultValue) ||
      JSON.stringify(row_data) === JSON.stringify(rowDataDefaultValue)
    )
      return res.status(202).json({ err: "All fields required" });

    const timesheet = await Timesheet.findOne({
      date_start,
      date_end,
      email: req.decoded.email,
    });
    if (timesheet) {
      timesheet.project_select_data = project_select_data;
      timesheet.task_select_data = task_select_data;
      timesheet.comment_data = comment_data;
      timesheet.row_data = row_data;
      timesheet.num_rows_per_activity = num_rows_per_activity;
      timesheet.activity_names = activity_names;

      await timesheet.save();
      return res.status(200).json({ msg: "Saved Timesheet" });
    }
    const newTimesheet = new Timesheet({
      date_start,
      date_end,
      email: req.decoded.email,
      project_select_data,
      task_select_data,
      comment_data,
      row_data,
      num_rows_per_activity,
      activity_names,
    });
    await newTimesheet.save();

    return res.status(200).json({ msg: "Saved Timesheet" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", err: error });
  }
};

module.exports = {
  TimesheetUploadController,
};
