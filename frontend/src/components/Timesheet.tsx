import { useState, useEffect } from "react";
import {
  getFirstDayOfWeek,
  getlastDayOfWeek,
  getDatesBetween,
  getDateStr,
} from "../ts/DateControls";
import {
  Activity_type,
  InputFieldCollection_type,
  jwt_decoded_response,
  Project_type,
  TimesheetTable_type,
} from "../ts/Types";
import {
  DECODE_JWT_ROUTE,
  GET_OWN_PROJECTS_ROUTE,
  SIGNOUT,
  TIMESHEET_ACTIVITIES,
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

const Timesheet = () => {
  const navigate = useNavigate();

  const [dateStart, setDateStart] = useState(getFirstDayOfWeek());
  const [dateEnd, setDateEnd] = useState(getlastDayOfWeek());
  const [datesBetween, setDatesBetween] = useState(
    getDatesBetween(dateStart, dateEnd)
  );
  const [totalHours, setTotalHours] = useState(0);

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
  const selectDataArrayDefaultValue = [[["", ""]], [["", ""]]];
  const numRowsPerActivityDefaultValue = [1, 1];

  const [rowDataArray, setRowDataArray] = useState(rowDataArrayDefaultValue);
  const [commentDataArray, setCommentDataArray] = useState(
    commentDataArrayDefaultValue
  );
  const [selectDataArray, setSelectDataArray] = useState(
    selectDataArrayDefaultValue
  );
  const [numRowsPerActivity, setNumRowsPerActivity] = useState(
    numRowsPerActivityDefaultValue
  );

  const clearAllInputFields = () => {
    setRowDataArray(rowDataArrayDefaultValue);
    setCommentDataArray(commentDataArrayDefaultValue);
    setSelectDataArray(selectDataArrayDefaultValue);
    setNumRowsPerActivity(numRowsPerActivityDefaultValue);
  };

  const [infoText, infoSetter] = useState<string>("");
  const setInfoText = (text: string) => infoSetter(`${text}~${Math.random()}`);
  const [isInfoError, setInfoError] = useState<boolean>(true);

  const onTimesheetUploadClicked = () => {
    
  };

  useEffect(() => {
    setDatesBetween(getDatesBetween(dateStart, dateEnd));
    clearAllInputFields();
  }, [dateStart, dateEnd]);

  const [userData, setUserData] = useState<jwt_decoded_response>();
  const getUserData = () => {
    axios
      .get(DECODE_JWT_ROUTE, {
        params: { token: sessionStorage.getItem("jwt") },
      })
      .then((res) => {
        if (res.status === 200) {
          setUserData(res.data as jwt_decoded_response);
        } else {
          navigate(`/${SIGNOUT}`);
        }
      })
      .catch(() => {
        navigate(`/${SIGNOUT}`);
      });
  };

  const [projects, setProjects] = useState<Project_type[]>([]);

  const getOwnProjects = () => {
    if (!userData) return;
    axios
      .get(GET_OWN_PROJECTS_ROUTE, {
        headers: {
          auth: `${userData.role} ${sessionStorage.getItem("jwt")}`,
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

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    getOwnProjects();
  }, [userData]);

  return (
    <Container containerHeading="Timesheet" headerType="l1">
      <ContainerForm
        containerHeading="Timesheet"
        headerType="l3"
        onSubmit={(e) => {
          e.preventDefault();
          onTimesheetUploadClicked();
        }}
      >
        <section className="flex flex-col md:flex-row gap-4 justify-between items-center ">
          <p>
            Total Hours:{" "}
            <span className="font-medium text-xl">{totalHours}</span>
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

        <TimesheetTable
          dates={datesBetween}
          numRowsPerActivity={numRowsPerActivity}
          setNumRowsPerActivity={setNumRowsPerActivity}
          selectDataArray={selectDataArray}
          setSelectDataArray={setSelectDataArray}
          rowDataArray={rowDataArray}
          setRowDataArray={setRowDataArray}
          commentDataArray={commentDataArray}
          setCommentDataArray={setCommentDataArray}
          totalHours={totalHours}
          setTotalHours={setTotalHours}
          projects={projects}
        />

        <Button type="submit">Upload Timesheet</Button>
        <InfoDisplay
          isError={isInfoError}
          infoText={infoText}
          className="-my-6"
        />
      </ContainerForm>
    </Container>
  );
};

const TimesheetTable = ({
  dates,
  numRowsPerActivity,
  setNumRowsPerActivity,
  selectDataArray,
  setSelectDataArray,
  rowDataArray,
  setRowDataArray,
  commentDataArray,
  setCommentDataArray,
  totalHours,
  setTotalHours,
  projects,
}: TimesheetTable_type) => {
  const [columnSum, setColumnSum] = useState([0, 0, 0, 0, 0, 0, 0]);

  const setNumRowsForActivity = (activityIndex: number) => {
    return (value: number) => {
      let numRowsPerActivityM = [...numRowsPerActivity];
      numRowsPerActivityM[activityIndex] = value;
      setNumRowsPerActivity(numRowsPerActivityM);
    };
  };

  const increaseActivityRowsForIndex = (index: number) => {
    return () => {
      let rowDataArrayM = [...rowDataArray];
      let rowData = rowDataArrayM[index];
      rowData.push([0, 0, 0, 0, 0, 0, 0]);
      setRowDataArray(rowDataArrayM);

      let commentDataArrayM = [...commentDataArray];
      let commentData = commentDataArrayM[index];
      commentData.push("");
      setCommentDataArray(commentDataArrayM);

      let selectDataArrayM = [...selectDataArray];
      let selectData = selectDataArrayM[index];
      selectData.push(["", ""]);
      setSelectDataArray(selectDataArrayM);
    };
  };

  const decreaseActivityRowsForIndex = (index: number) => {
    return () => {
      let rowDataArrayM = [...rowDataArray];
      let rowData = rowDataArrayM[index];
      rowData.pop();
      setRowDataArray(rowDataArrayM);

      let commentDataArrayM = [...commentDataArray];
      let commentData = commentDataArrayM[index];
      commentData.pop();
      setCommentDataArray(commentDataArrayM);

      let selectDataArrayM = [...selectDataArray];
      let selectData = selectDataArrayM[index];
      selectData.pop();
      setSelectDataArray(selectDataArrayM);
    };
  };

  const setRowDataForActivity = (activityIndex: number) => {
    return (rowIndex: number) => {
      return (value: number[]) => {
        let rowDataArrayM = [...rowDataArray];
        let rowData = rowDataArrayM[activityIndex];
        rowData[rowIndex] = value;
        setRowDataArray(rowDataArrayM);
      };
    };
  };

  const setSelectDataForActivity = (activityIndex: number) => {
    return (rowIndex: number) => {
      return (index: number, value: string) => {
        let selectDataArrayM = [...selectDataArray];
        let activityData = selectDataArrayM[activityIndex];
        let rowData = activityData[rowIndex];
        rowData[index] = value;
        setSelectDataArray(selectDataArrayM);
      };
    };
  };

  const setCommentDataForActivity = (activityIndex: number) => {
    return (rowIndex: number) => {
      return (value: string) => {
        let commentDataArrayM = [...commentDataArray];
        let activityData = commentDataArrayM[activityIndex];
        activityData[rowIndex] = value;
        setCommentDataArray(commentDataArrayM);
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
    <Table>
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
        {TIMESHEET_ACTIVITIES.map((item, index) => (
          <Activity
            key={index}
            activity_name={item}
            numRows={numRowsPerActivity[index]}
            setNumRows={setNumRowsForActivity(index)}
            increaseActivityRows={increaseActivityRowsForIndex(index)}
            decreaseActivityRows={decreaseActivityRowsForIndex(index)}
            rowData={rowDataArray[index]}
            setRowData={setRowDataForActivity(index)}
            selectData={selectDataArray[index]}
            setSelectData={setSelectDataForActivity(index)}
            commentData={commentDataArray[index]}
            setCommentData={setCommentDataForActivity(index)}
            projects={projects}
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
  selectData,
  setSelectData,
  commentData,
  setCommentData,
  projects,
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
            selectData={selectData[i]}
            setSelectData={setSelectData(i)}
            commentData={commentData[i]}
            setCommentData={setCommentData(i)}
            projects={projects}
          />
          <TableCell>{rowSum[i]}</TableCell>
        </TableRow>
      ))}
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
    </>
  );
};

const InputFieldsCollection = ({
  rowData,
  setRowData,
  selectData,
  setSelectData,
  commentData,
  setCommentData,
  projects,
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
          value={selectData[0]}
          onChange={(e) => setSelectData(0, e.target.value)}
        >
          {projects.map((item, index) => (
            <option key={index} value={item.name}>
              {item.name}
            </option>
          ))}
        </Select>
      </TableCell>
      <TableCell className="max-w-24">
        <Select
          id="task"
          value={selectData[1]}
          onChange={(e) => setSelectData(1, e.target.value)}
        ></Select>
      </TableCell>
      <TableCell className="max-w-24">
        <Input
          id="comment"
          type="text"
          placeholder="Comment"
          value={commentData}
          onChange={(e) => setCommentData(e.target.value)}
        />
      </TableCell>
      {rowData.map((value, index) => (
        <TableCell key={index} className="max-w-12">
          <Input
            type="text"
            textCenter
            value={value}
            onChange={(e) => handleNumericInputs(index, e.target.value)}
          />
        </TableCell>
      ))}
    </>
  );
};

export default Timesheet;
