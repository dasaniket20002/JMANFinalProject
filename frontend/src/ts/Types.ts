import { To } from "react-router-dom";
import { ClassNameValue } from "tailwind-merge";

export type InfoDisplay_type = {
  isError: boolean;
  infoText: string;
} & OptionalClassname;

export type User_type = {
  name: string;
  email: string;
  role: string;
};
export type Project_type = {
  _id: string;
  name: string;
  question_ids: string[];
  users: string[];
};
export type FeedbackQuestion_type = {
  _id: string;
  question: string;
};
export type TimesheetTable_type = {
  dates: number[];
  numRowsPerActivity: number[];
  setNumRowsPerActivity: React.Dispatch<React.SetStateAction<number[]>>;
  selectDataArray: string[][][];
  setSelectDataArray: React.Dispatch<React.SetStateAction<string[][][]>>;
  rowDataArray: number[][][];
  setRowDataArray: React.Dispatch<React.SetStateAction<number[][][]>>;
  commentDataArray: string[][];
  setCommentDataArray: React.Dispatch<React.SetStateAction<string[][]>>;
  totalHours: number;
  setTotalHours: React.Dispatch<React.SetStateAction<number>>;

  projects: Project_type[];
};
export type Activity_type = {
  activity_name: string;
  numRows: number;
  setNumRows: (value: number) => void;
  increaseActivityRows: () => void;
  decreaseActivityRows: () => void;
  rowData: number[][];
  setRowData: (rowIndex: number) => (value: number[]) => void;
  selectData: string[][];
  setSelectData: (rowIndex: number) => (index: number, value: string) => void;
  commentData: string[];
  setCommentData: (rowIndex: number) => (value: string) => void;

  projects: Project_type[];
};
export type InputFieldCollection_type = {
  rowData: number[];
  setRowData: (value: number[]) => void;
  selectData: string[];
  setSelectData: (index: number, value: string) => void;
  commentData: string;
  setCommentData: (value: string) => void;

  projects: Project_type[];
};

export type jwt_decoded_response = {
  name: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
};

export type Container_type = {
  containerHeading: string | boolean | JSX.Element;
  headerType?: "l1" | "l2" | "l3";
} & OptionalChildren &
  OptionalClassname &
  Bulged;

export type ContainerForm_type = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
} & Container_type;

export type Button_type = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
} & OptionalChildren &
  OptionalClassname &
  Bulged;

export type Link_type = {
  to: To;
} & OptionalClassname &
  OptionalChildren &
  Bulged;

export type Input_type = {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
} & InputCommon &
  OptionalClassname &
  Bulged &
  TextCentered;

export type Select_type = {
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
} & Omit<InputCommon, "type"> &
  OptionalClassname &
  OptionalChildren &
  Bulged &
  TextCentered;

export type TableCell_type = {
  rowSpan?: number;
  colSpan?: number;
} & OptionalChildren &
  OptionalClassname;

type InputCommon = {
  value?: string | number | readonly string[];
  type?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  label?: string;
};
type Bulged = {
  bulged?: boolean;
};
type TextCentered = {
  textCenter?: boolean;
};
export type OptionalChildren = {
  children?:
    | (boolean | string | number | JSX.Element | JSX.Element[])
    | (boolean | string | number | JSX.Element | JSX.Element[])[];
};
export type OptionalClassname = {
  className?: ClassNameValue;
};
