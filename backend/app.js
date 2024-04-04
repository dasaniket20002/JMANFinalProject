const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const indexRouter = require("./routes/index");
const authenticationRouter = require("./routes/authentication");
const authorizationRouter = require("./routes/authorization");
const changePassRouter = require("./routes/changePassPath");
const generateForgetPathRoute = require("./routes/generateForgetPath");
const timesheetRoute = require("./routes/timesheet");

const app = express();
app.use(require("cors")());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_UID}:${process.env.MONGO_PASS}@cluster0.xc9x9f1.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => console.log("Connected To MongoDB"))
  .catch((err) => console.log(err));

app.use("/", indexRouter);
app.use("/authenticate", authenticationRouter);
app.use("/authorize", authorizationRouter);
app.use("/changepass", changePassRouter);
app.use("/forgotpass", generateForgetPathRoute);
app.use("/timesheet", timesheetRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
