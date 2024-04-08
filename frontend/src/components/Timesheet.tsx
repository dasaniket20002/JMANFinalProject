import { useState, useEffect, useRef, useContext } from "react";
import {
  getFirstDayOfWeek,
  getlastDayOfWeek,
  getDatesBetween,
  getDateStr,
} from "../ts/DateControls";
import {
  Activity_type,
  InputFieldCollection_type,
  Project_type,
  TimesheetTable_type,
  User_type,
} from "../ts/Types";
import {
  FEEDBACK,
  GET_ALL_USERS_ROUTE,
  GET_OWN_PROJECTS_ROUTE,
  SIGNOUT,
  TIMESHEET_ACTIVITIES,
  TIMESHEET_FETCH_ALL_ROUTE,
  TIMESHEET_FETCH_ROUTE,
  TIMESHEET_UPLOAD_ROUTE,
} from "../ts/Consts";
import Container from "./misc/Container";
import Button from "./misc/Button";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./misc/Table";
import Select from "./misc/Select";
import Input from "./misc/Input";
import ContainerForm from "./misc/ContainerForm";
import InfoDisplay from "./misc/InfoDisplay";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "./AuthenticationProvider";

const Timesheet = () => {
  const navigate = useNavigate();

  const { userData, accessTo, JWT, isAuthenticating } = useContext(
    AuthenticationContext
  );

  useEffect(() => {
    if (isAuthenticating) return;
    if (!JWT) {
      navigate(`/${SIGNOUT}`);
    }
  }, [JWT, isAuthenticating]);

  const [projects, setProjects] = useState<Project_type[]>([]);
  const getOwnProjects = () => {
    if (!userData) return;
    axios
      .get(GET_OWN_PROJECTS_ROUTE, {
        headers: {
          auth: `${userData.role} ${JWT}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setProjects(res.data.projects);
        } else {
          console.log(res.data.err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [dateStart, setDateStart] = useState(getFirstDayOfWeek());
  const [dateEnd, setDateEnd] = useState(getlastDayOfWeek());
  const [datesBetween, setDatesBetween] = useState(
    getDatesBetween(dateStart, dateEnd)
  );

  const increaseDatesHandle = () => {
    let dateStartM = dateStart;
    setDateStart(dateStartM.add(7, "day"));
    let dateEndM = dateEnd;
    setDateEnd(dateEndM.add(7, "day"));
  };
  const decreaseDatesHandle = () => {
    let dateStartM = dateStart;
    setDateStart(dateStartM.subtract(7, "day"));
    let dateEndM = dateEnd;
    setDateEnd(dateEndM.subtract(7, "day"));
  };

  const rowDataArrayDefaultValue = [
    [[0, 0, 0, 0, 0, 0, 0]],
    [[0, 0, 0, 0, 0, 0, 0]],
  ];
  const commentDataArrayDefaultValue = [[""], [""]];
  const projectSelectArrayDefaultValue = [[""], [""]];
  const taskSelectArrayDefaultValue = [[""], [""]];

  const [rowDataArray, setRowDataArray] = useState(rowDataArrayDefaultValue);
  const [commentDataArray, setCommentDataArray] = useState(
    commentDataArrayDefaultValue
  );
  const [projectSelectDataArray, setProjectSelectDataArray] = useState(
    projectSelectArrayDefaultValue
  );
  const [taskSelectDataArray, setTaskSelectDataArray] = useState(
    taskSelectArrayDefaultValue
  );
  const [numRowsPerActivity, setNumRowsPerActivity] = useState([
    ...(Array.from(
      { length: TIMESHEET_ACTIVITIES.length },
      () => 1 as number
    ) as number[]),
  ]);
  const [timesheetActivities, setTimesheetActivities] =
    useState(TIMESHEET_ACTIVITIES);

  const getOwnTimesheet = () => {
    axios
      .get(TIMESHEET_FETCH_ROUTE, {
        params: {
          date_start: getDateStr(dateStart),
          date_end: getDateStr(dateEnd),
        },
        headers: {
          auth: `${userData?.role} ${JWT}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setRowDataArray(res.data.timesheet.row_data);
          setCommentDataArray(res.data.timesheet.comment_data);
          setProjectSelectDataArray(res.data.timesheet.project_select_data);
          setTaskSelectDataArray(res.data.timesheet.task_select_data);
          setNumRowsPerActivity(res.data.timesheet.num_rows_per_activity);
          setTimesheetActivities(res.data.timesheet.activity_names);
        } else {
          clearAllInputFields();
        }
      })
      .catch((err) => {
        console.log(err);
        clearAllInputFields();
      });
  };

  const clearAllInputFields = () => {
    setRowDataArray(rowDataArrayDefaultValue);
    setCommentDataArray(commentDataArrayDefaultValue);
    setProjectSelectDataArray(projectSelectArrayDefaultValue);
    setTaskSelectDataArray(taskSelectArrayDefaultValue);
    setNumRowsPerActivity([
      ...(Array.from(
        { length: TIMESHEET_ACTIVITIES.length },
        () => 1 as number
      ) as number[]),
    ]);
  };

  const [infoText, infoSetter] = useState<string>("");
  const setInfoText = (text: string) => infoSetter(`${text}~${Math.random()}`);
  const [isInfoError, setInfoError] = useState<boolean>(true);
  const timesheetUploadButtonRef = useRef<HTMLButtonElement>(null);

  const onTimesheetUploadClicked = () => {
    setInfoText("Loading...");
    setInfoError(false);
    if (timesheetUploadButtonRef.current)
      timesheetUploadButtonRef.current.disabled = true;

    axios
      .post(
        TIMESHEET_UPLOAD_ROUTE,
        {
          date_start: getDateStr(dateStart),
          date_end: getDateStr(dateEnd),
          project_select_data: projectSelectDataArray,
          task_select_data: taskSelectDataArray,
          comment_data: commentDataArray,
          row_data: rowDataArray,
          num_rows_per_activity: numRowsPerActivity,
          activity_names: timesheetActivities,
        },
        {
          headers: {
            auth: `${userData?.role} ${JWT}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setInfoText(res.data.msg);
          setInfoError(false);

          navigate(`/${FEEDBACK}`, {
            state: {
              dateStart: getDateStr(dateStart),
              dateEnd: getDateStr(dateEnd),
            },
          });
        } else {
          setInfoText(res.data.err);
          setInfoError(true);
        }
        if (timesheetUploadButtonRef.current)
          timesheetUploadButtonRef.current.disabled = false;
      })
      .catch((err) => {
        setInfoText(err.code);
        setInfoError(true);
        if (timesheetUploadButtonRef.current)
          timesheetUploadButtonRef.current.disabled = false;
      });
  };

  useEffect(() => {
    setDatesBetween(getDatesBetween(dateStart, dateEnd));
    getOwnTimesheet();
  }, [dateStart, dateEnd]);

  useEffect(() => {
    getOwnProjects();
    getOwnTimesheet();
  }, [accessTo]);

  return (
    <>
      <Container containerHeading="Timesheet" headerType="l1">
        {accessTo.includes("TIMESHEET") ? (
          <ContainerForm
            containerHeading="Timesheet"
            headerType="l3"
            onSubmit={(e) => {
              e.preventDefault();
              onTimesheetUploadClicked();
            }}
          >
            <TimesheetTable
              dateStart={dateStart}
              dateEnd={dateEnd}
              dates={datesBetween}
              increaseDatesHandle={increaseDatesHandle}
              decreaseDatesHandle={decreaseDatesHandle}
              numRowsPerActivity={numRowsPerActivity}
              setNumRowsPerActivity={setNumRowsPerActivity}
              rowDataArray={rowDataArray}
              setRowDataArray={setRowDataArray}
              commentDataArray={commentDataArray}
              setCommentDataArray={setCommentDataArray}
              projectSelectDataArray={projectSelectDataArray}
              setProjectSelectDataArray={setProjectSelectDataArray}
              taskSelectDataArray={taskSelectDataArray}
              setTaskSelectDataArray={setTaskSelectDataArray}
              timesheetActivities={timesheetActivities}
              projects={projects}
            />

            <Button ref={timesheetUploadButtonRef} type="submit">
              Upload Timesheet
            </Button>
            <InfoDisplay
              isError={isInfoError}
              infoText={infoText}
              className="-my-6"
            />
          </ContainerForm>
        ) : (
          <p className="text-red-500 text-2xl font-medium">
            You do not have access to Timesheet
          </p>
        )}
      </Container>
      {userData &&
        accessTo &&
        accessTo.some((access) =>
          ["TIMESHEET_ALL", "SEE_USERS"].includes(access)
        ) && <AdditionalControls />}
    </>
  );
};

const TimesheetTable = ({
  dateStart,
  dateEnd,
  dates,
  increaseDatesHandle,
  decreaseDatesHandle,
  numRowsPerActivity,
  setNumRowsPerActivity,
  rowDataArray,
  setRowDataArray,
  commentDataArray,
  setCommentDataArray,
  projectSelectDataArray,
  setProjectSelectDataArray,
  taskSelectDataArray,
  setTaskSelectDataArray,
  timesheetActivities,
  projects,
  inputsDisabled,
  bulged,
}: TimesheetTable_type) => {
  const [columnSum, setColumnSum] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [totalHours, setTotalHours] = useState(0);

  const setNumRowsForActivity = (activityIndex: number) => {
    return (value: number) => {
      let numRowsPerActivityM = [...numRowsPerActivity];
      numRowsPerActivityM[activityIndex] = value;
      setNumRowsPerActivity && setNumRowsPerActivity(numRowsPerActivityM);
    };
  };

  const increaseActivityRowsForIndex = (index: number) => {
    return () => {
      let rowDataArrayM = [...rowDataArray];
      let rowData = rowDataArrayM[index];
      rowData.push([0, 0, 0, 0, 0, 0, 0]);
      setRowDataArray && setRowDataArray(rowDataArrayM);

      let commentDataArrayM = [...commentDataArray];
      let commentData = commentDataArrayM[index];
      commentData.push("");
      setCommentDataArray && setCommentDataArray(commentDataArrayM);

      let projectDataArrayM = [...projectSelectDataArray];
      let projectData = projectDataArrayM[index];
      projectData.push("");
      setProjectSelectDataArray && setProjectSelectDataArray(projectDataArrayM);

      let taskDataArrayM = [...taskSelectDataArray];
      let taskData = taskDataArrayM[index];
      taskData.push("");
      setCommentDataArray && setCommentDataArray(taskDataArrayM);
    };
  };

  const decreaseActivityRowsForIndex = (index: number) => {
    return () => {
      let rowDataArrayM = [...rowDataArray];
      let rowData = rowDataArrayM[index];
      rowData.pop();
      setRowDataArray && setRowDataArray(rowDataArrayM);

      let commentDataArrayM = [...commentDataArray];
      let commentData = commentDataArrayM[index];
      commentData.pop();
      setCommentDataArray && setCommentDataArray(commentDataArrayM);

      let projectDataArrayM = [...projectSelectDataArray];
      let projectData = projectDataArrayM[index];
      projectData.pop();
      setProjectSelectDataArray && setProjectSelectDataArray(projectDataArrayM);

      let taskDataArrayM = [...taskSelectDataArray];
      let taskData = taskDataArrayM[index];
      taskData.pop();
      setCommentDataArray && setCommentDataArray(taskDataArrayM);
    };
  };

  const setRowDataForActivity = (activityIndex: number) => {
    return (rowIndex: number) => {
      return (value: number[]) => {
        let rowDataArrayM = [...rowDataArray];
        let rowData = rowDataArrayM[activityIndex];
        rowData[rowIndex] = value;
        setRowDataArray && setRowDataArray(rowDataArrayM);
      };
    };
  };

  const setProjectSelectDataForActivity = (activityIndex: number) => {
    return (rowIndex: number) => {
      return (value: string) => {
        let projectSelectDataArrayM = [...projectSelectDataArray];
        let activityData = projectSelectDataArrayM[activityIndex];
        activityData[rowIndex] = value;
        setProjectSelectDataArray &&
          setProjectSelectDataArray(projectSelectDataArrayM);
      };
    };
  };

  const setTaskSelectDataForActivity = (activityIndex: number) => {
    return (rowIndex: number) => {
      return (value: string) => {
        let taskSelectDataArrayM = [...taskSelectDataArray];
        let activityData = taskSelectDataArrayM[activityIndex];
        activityData[rowIndex] = value;
        setTaskSelectDataArray && setTaskSelectDataArray(taskSelectDataArrayM);
      };
    };
  };

  const setCommentDataForActivity = (activityIndex: number) => {
    return (rowIndex: number) => {
      return (value: string) => {
        let commentDataArrayM = [...commentDataArray];
        let activityData = commentDataArrayM[activityIndex];
        activityData[rowIndex] = value;
        setCommentDataArray && setCommentDataArray(commentDataArrayM);
      };
    };
  };

  const calculateColumnSum = () => {
    let sum = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < rowDataArray.length; i++) {
      for (let j = 0; j < rowDataArray[i].length; j++) {
        const row = rowDataArray[i][j];
        for (let k = 0; k < 7; k++) {
          if (row[k] !== 0) sum[k] += row[k];
        }
      }
    }
    setColumnSum(sum);
  };

  const calculateTotalHours = () => {
    return columnSum.reduce((a, b) => a + b, 0);
  };

  useEffect(() => {
    calculateColumnSum();
  }, [rowDataArray]);

  useEffect(() => {
    setTotalHours(calculateTotalHours());
  }, [columnSum]);

  return (
    <>
      <section className="flex flex-col md:flex-row gap-4 justify-between items-center ">
        <p>
          Total Hours: <span className="font-medium text-xl">{totalHours}</span>
        </p>
        <span className="flex items-center">
          <Button
            className="px-4 py-1 mr-8 shadow-md"
            onClick={(e) => {
              e.preventDefault();
              increaseDatesHandle();
            }}
          >
            {"<"}
          </Button>
          <p className="text-center outline-none rounded focus:border focus:border-gray-800">
            {getDateStr(dateStart)} - {getDateStr(dateEnd)}
          </p>
          <Button
            className="px-4 py-1 ml-8 shadow-md"
            onClick={(e) => {
              e.preventDefault();
              decreaseDatesHandle();
            }}
          >
            {">"}
          </Button>
        </span>
      </section>
      <Table bulged={bulged}>
        <TableHead>
          <TableHeader className="text-base">Project Type</TableHeader>
          <TableHeader className="text-base">Project Name</TableHeader>
          <TableHeader className="text-base">Task</TableHeader>
          <TableHeader className="text-base">Comment</TableHeader>
          <TableHeader className="text-base">
            Sun
            <br />
            {dates[0]}
          </TableHeader>
          <TableHeader className="text-base">
            Mon
            <br />
            {dates[1]}
          </TableHeader>
          <TableHeader className="text-base">
            Tue
            <br />
            {dates[2]}
          </TableHeader>
          <TableHeader className="text-base">
            Wed
            <br />
            {dates[3]}
          </TableHeader>
          <TableHeader className="text-base">
            Thu
            <br />
            {dates[4]}
          </TableHeader>
          <TableHeader className="text-base">
            Fri
            <br />
            {dates[5]}
          </TableHeader>
          <TableHeader className="text-base">
            Sat
            <br />
            {dates[6]}
          </TableHeader>
          <TableHeader className="text-base">Total</TableHeader>
        </TableHead>
        <TableBody>
          {timesheetActivities.map((item, index) => (
            <Activity
              key={index}
              activity_name={item}
              numRows={numRowsPerActivity[index]}
              setNumRows={setNumRowsForActivity(index)}
              increaseActivityRows={increaseActivityRowsForIndex(index)}
              decreaseActivityRows={decreaseActivityRowsForIndex(index)}
              rowData={rowDataArray[index]}
              setRowData={setRowDataForActivity(index)}
              commentData={commentDataArray[index]}
              setCommentData={setCommentDataForActivity(index)}
              projectData={projectSelectDataArray[index]}
              setProjectData={setProjectSelectDataForActivity(index)}
              taskData={taskSelectDataArray[index]}
              setTaskData={setTaskSelectDataForActivity(index)}
              projects={projects}
              inputsDisabled={inputsDisabled}
            />
          ))}
          <TableRow>
            <TableCell>Total Hours</TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
            {columnSum.map((item, i) => (
              <TableCell key={i} className={item >= 8 && "text-red-500"}>
                {item}
              </TableCell>
            ))}
            <td className="py-2">{totalHours}</td>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

const Activity = ({
  activity_name,
  numRows,
  setNumRows,
  increaseActivityRows,
  decreaseActivityRows,
  rowData,
  setRowData,
  commentData,
  setCommentData,
  projectData,
  setProjectData,
  taskData,
  setTaskData,
  projects,
  inputsDisabled,
}: Activity_type) => {
  const [rowSum, setRowSum] = useState([0]);
  const calculateRowSum = () => {
    let rowSumM = [...rowSum];
    for (let j = 0; j < rowData.length; j++) {
      let sum = 0;
      for (let k = 0; k < rowData[j].length; k++) {
        if (rowData[j][k] !== 0) sum += rowData[j][k];
      }
      rowSumM[j] = sum;
    }
    setRowSum(rowSumM);
  };

  const increaseRowsForActivity = () => {
    setNumRows(numRows + 1);
    increaseActivityRows();
    setRowSum([...rowSum, 0]);
  };
  const decreaseRowsForActivity = () => {
    if (numRows <= 1) return;
    setNumRows(numRows - 1);
    decreaseActivityRows();
    setRowSum([...rowSum].splice(-1));
  };

  useEffect(() => {
    calculateRowSum();
  }, [setRowData]);

  return (
    <>
      {[...Array(numRows)].map((_, i) => (
        <TableRow key={i}>
          {i === 0 && <TableCell rowSpan={numRows}>{activity_name}</TableCell>}
          <InputFieldsCollection
            rowData={rowData[i]}
            setRowData={setRowData(i)}
            commentData={commentData[i]}
            setCommentData={setCommentData(i)}
            projectData={projectData[i]}
            setProjectData={setProjectData(i)}
            taskData={taskData[i]}
            setTaskData={setTaskData(i)}
            projects={projects}
            inputsDisabled={inputsDisabled}
          />
          <TableCell>{rowSum[i]}</TableCell>
        </TableRow>
      ))}
      {!inputsDisabled && (
        <TableRow>
          <TableCell colSpan={9999}>
            <span className="flex justify-evenly gap-6 px-2">
              <Button
                className="w-full shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  increaseRowsForActivity();
                }}
              >
                +
              </Button>
              <Button
                className="w-full shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  decreaseRowsForActivity();
                }}
              >
                -
              </Button>
            </span>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const InputFieldsCollection = ({
  rowData,
  setRowData,
  commentData,
  setCommentData,
  projectData,
  setProjectData,
  taskData,
  setTaskData,
  projects,
  inputsDisabled,
}: InputFieldCollection_type) => {
  const handleNumericInputs = (index: number, value: string) => {
    const num = Number(value);
    if (isNaN(num)) return;

    const actualValue = num < 0 ? 0 : num > 12 ? 12 : num;
    let inputValues = [...rowData];
    inputValues[index] = actualValue;
    setRowData(inputValues);
  };

  return (
    <>
      <TableCell className="max-w-24">
        <Select
          id="project"
          value={projectData}
          onChange={(e) => setProjectData(e.target.value)}
          disabled={inputsDisabled}
        >
          {projects?.map((item, index) => (
            <option key={index} value={item.name}>
              {item.name}
            </option>
          ))}
        </Select>
      </TableCell>
      <TableCell className="max-w-24">
        <Select
          id="task"
          value={taskData}
          onChange={(e) => setTaskData(e.target.value)}
          disabled={inputsDisabled}
        ></Select>
      </TableCell>
      <TableCell className="max-w-24">
        <Input
          id="comment"
          type="text"
          placeholder="Comment"
          value={commentData}
          onChange={(e) => setCommentData(e.target.value)}
          disabled={inputsDisabled}
        />
      </TableCell>
      {rowData.map((value, index) => (
        <TableCell key={index} className="max-w-12">
          <Input
            type="text"
            textCenter
            value={value}
            onChange={(e) => handleNumericInputs(index, e.target.value)}
            disabled={inputsDisabled}
          />
        </TableCell>
      ))}
    </>
  );
};

const AdditionalControls = () => {
  const { userData, JWT } = useContext(AuthenticationContext);

  const [users, setUsers] = useState<User_type[]>([]);
  const getAllUsers = () => {
    axios
      .get(GET_ALL_USERS_ROUTE, {
        headers: {
          auth: `${userData?.role} ${JWT}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setUsers(res.data.users as User_type[]);
        } else {
          console.log(res.data.err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [selectedUser, setSelectedUser] = useState<string>("");

  const [dateStart, setDateStart] = useState(getFirstDayOfWeek());
  const [dateEnd, setDateEnd] = useState(getlastDayOfWeek());
  const [datesBetween, setDatesBetween] = useState(
    getDatesBetween(dateStart, dateEnd)
  );

  const increaseDatesHandle = () => {
    let dateStartM = dateStart;
    setDateStart(dateStartM.add(7, "day"));
    let dateEndM = dateEnd;
    setDateEnd(dateEndM.add(7, "day"));
  };
  const decreaseDatesHandle = () => {
    let dateStartM = dateStart;
    setDateStart(dateStartM.subtract(7, "day"));
    let dateEndM = dateEnd;
    setDateEnd(dateEndM.subtract(7, "day"));
  };

  const rowDataArrayDefaultValue = [
    [[0, 0, 0, 0, 0, 0, 0]],
    [[0, 0, 0, 0, 0, 0, 0]],
  ];
  const commentDataArrayDefaultValue = [[""], [""]];
  const projectSelectArrayDefaultValue = [[""], [""]];
  const taskSelectArrayDefaultValue = [[""], [""]];

  const [rowDataArray, setRowDataArray] = useState(rowDataArrayDefaultValue);
  const [commentDataArray, setCommentDataArray] = useState(
    commentDataArrayDefaultValue
  );
  const [projectSelectDataArray, setProjectSelectDataArray] = useState(
    projectSelectArrayDefaultValue
  );
  const [taskSelectDataArray, setTaskSelectDataArray] = useState(
    taskSelectArrayDefaultValue
  );
  const [numRowsPerActivity, setNumRowsPerActivity] = useState([
    ...(Array.from({ length: TIMESHEET_ACTIVITIES.length }) as number[]),
  ]);
  const [timesheetActivities, setTimesheetActivities] =
    useState(TIMESHEET_ACTIVITIES);

  const [timesheetUploadedOn, setTimesheetUploadedOn] = useState<string>("");

  const clearAllInputFields = () => {
    setRowDataArray(rowDataArrayDefaultValue);
    setCommentDataArray(commentDataArrayDefaultValue);
    setProjectSelectDataArray(projectSelectArrayDefaultValue);
    setTaskSelectDataArray(taskSelectArrayDefaultValue);
    setNumRowsPerActivity([
      ...(Array.from({ length: timesheetActivities.length }) as number[]),
    ]);
    setTimesheetUploadedOn("");
  };

  const onUserSelected = () => {
    axios
      .post(
        TIMESHEET_FETCH_ALL_ROUTE,
        {
          email: selectedUser,
          date_start: getDateStr(dateStart),
          date_end: getDateStr(dateEnd),
        },
        {
          headers: {
            auth: `${userData?.role} ${JWT}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setRowDataArray(res.data.timesheet.row_data);
          setCommentDataArray(res.data.timesheet.comment_data);
          setProjectSelectDataArray(res.data.timesheet.project_select_data);
          setTaskSelectDataArray(res.data.timesheet.task_select_data);
          setNumRowsPerActivity(res.data.timesheet.num_rows_per_activity);
          setTimesheetActivities(res.data.timesheet.activity_names);
          setTimesheetUploadedOn(res.data.timesheet.uploaded_at);
        } else {
          clearAllInputFields();
        }
      })
      .catch((err) => {
        console.log(err);
        clearAllInputFields();
      });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    onUserSelected();
  }, [selectedUser, dateStart, dateEnd]);

  useEffect(() => {
    setDatesBetween(getDatesBetween(dateStart, dateEnd));
  }, [dateStart, dateEnd]);

  return (
    <Container containerHeading="Additional Controls" headerType="l2">
      <Container containerHeading="Users' Timesheets" headerType="l3">
        <Select
          id="userSelect"
          onChange={(e) => setSelectedUser(e.target.value)}
          value={selectedUser}
          bulged
          normalCase
        >
          {users.map((user, index) => (
            <option key={index} value={user.email}>
              {user.email}
            </option>
          ))}
        </Select>
        <TimesheetTable
          dateStart={dateStart}
          dateEnd={dateEnd}
          dates={datesBetween}
          increaseDatesHandle={increaseDatesHandle}
          decreaseDatesHandle={decreaseDatesHandle}
          numRowsPerActivity={numRowsPerActivity}
          rowDataArray={rowDataArray}
          commentDataArray={commentDataArray}
          projectSelectDataArray={projectSelectDataArray}
          taskSelectDataArray={taskSelectDataArray}
          timesheetActivities={timesheetActivities}
          inputsDisabled
          bulged
        />
        {timesheetUploadedOn !== "" && (
          <p className="text-xs text-right">
            Uploaded on:{" "}
            <span className="font-medium">{timesheetUploadedOn}</span>
          </p>
        )}
      </Container>
    </Container>
  );
};

export default Timesheet;
