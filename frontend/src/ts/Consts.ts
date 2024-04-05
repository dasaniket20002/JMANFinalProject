export const SERVER_IP = "http://localhost:5000";

export const LOGIN_ROUTE = `${SERVER_IP}/authenticate/login`;
export const REGISTER_ROUTE = `${SERVER_IP}/authenticate/register`;
export const ADD_PROJECT_ROUTE = `${SERVER_IP}/authenticate/addProject`;
export const ADD_FEEDBACK_QUESTION_ROUTE = `${SERVER_IP}/authenticate/addFeedbackQuestion`;
export const ASSIGN_USER_TO_PROJECT_ROUTE = `${SERVER_IP}/authenticate/assignProject`;

export const GET_PERMISSIONS = `${SERVER_IP}/authorize/getPermissions`;
export const DECODE_JWT_ROUTE = `${SERVER_IP}/authorize/decodeJWT`;
export const GET_ALL_USERS_ROUTE = `${SERVER_IP}/authorize/getAllUsers`;
export const GET_ALL_PROJECTS_ROUTE = `${SERVER_IP}/authorize/getAllProjects`;
export const GET_OWN_PROJECTS_ROUTE = `${SERVER_IP}/authorize/getOwnProjects`;
export const GET_ALL_FEEDBACK_QUESTIONS_ROUTE = `${SERVER_IP}/authorize/getAllFeedbackQuestions`;
export const GET_OWN_FEEDBACK_QUESTIONS_ROUTE = `${SERVER_IP}/authorize/getOwnFeedbackQuestions`;

export const TIMESHEET_UPLOAD_ROUTE = `${SERVER_IP}/timesheet/upload`;
export const TIMESHEET_FETCH_ROUTE = `${SERVER_IP}/timesheet/fetchOwn`;
export const TIMESHEET_FETCH_ALL_ROUTE = `${SERVER_IP}/timesheet/fetchAll`;

export const CHANGE_PASSWORD_ROUTE = `${SERVER_IP}/changepass`;
export const CHANGE_PASSWORD_REQUESTING_EMAIL_ROUTE = `${SERVER_IP}/changepass/getLinkedEmail`;
export const FORGOT_PASSWORD_ROUTE = `${SERVER_IP}/forgotpass`;

export const ROOT = "/";
export const DASHBOARD = "dashboard";
export const FEEDBACK = "feedback";
export const TIMESHEET = "timesheet";
export const FORGOT_PASSWORD = "forgotpass";
export const CHANGE_PASSWORD = "changepass";
export const SIGNOUT = "signout";

export const DEFAULT_PASSWORD = "org_pass_1234";

export const INFO_DISPLAY_TIMEOUT = 5000;

export const ROLES = ["admin", "user", "manager", "employee"];

export const TIMESHEET_ACTIVITIES = ["BAU Activity", "Sales Activity"];
