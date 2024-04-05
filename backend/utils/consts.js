const ROUTE_PERMISSION_DEFS = {
  "/authenticate/login": "",
  "/authenticate/register": "REGISTER_USER",
  "/authenticate/addProject": "CREATE_PROJECTS",
  "/authenticate/addFeedbackQuestion": "CREATE_QUESTIONS",
  "/authenticate/assignProject": "ASSIGN_USER_TO_PROJECTS",
  "/authorize/getPermissions": "SEE_PERMISSIONS",
  "/authorize/decodeJWT": "",
  "/authorize/getAllUsers": "SEE_USERS",
  "/authorize/getAllProjects": "SEE_PROJECTS",
  "/authorize/getOwnProjects": "SEE_OWN_PROJECTS",
  "/authorize/getAllFeedbackQuestions": "SEE_QUESTIONS",
  "/authorize/getOwnFeedbackQuestions": "SEE_OWN_QUESTIONS",
  "/changepass": "",
  "/changepass/getLinkedEmail": "",
  "/forgotpass": "",
  "/timesheet/upload": "TIMESHEET",
  "/timesheet/fetchOwn": "TIMESHEET",
  "/timesheet/fetchAll": "TIMESHEET_ALL",
};

const GET_TASK_PERFORMED = (req) => {
  return ROUTE_PERMISSION_DEFS[
    req._parsedOriginalUrl ? req._parsedOriginalUrl.pathname : req.originalUrl
  ];
};

module.exports = {
  ROUTE_PERMISSION_DEFS,
  GET_TASK_PERFORMED,
};
