import dayjs from "dayjs";

export const getDateStr = (date: dayjs.Dayjs, delimiter?: String) => {
  return (
    (date.date() <= 9 ? "0" + date.date() : date.date()) +
    (delimiter ? delimiter.toString() : "-") +
    (date.month() + 1 <= 9 ? "0" + (date.month() + 1) : date.month() + 1) +
    (delimiter ? delimiter.toString() : "-") +
    date.year()
  );
};

export const getFirstDayOfWeek = () => {
  const now = dayjs();
  const dayOfWeek = now.day();

  return now.subtract(dayOfWeek, "day");
};

export const getlastDayOfWeek = () => {
  return getFirstDayOfWeek().add(6, "day");
};

export const getDatesBetween = (from: dayjs.Dayjs, to: dayjs.Dayjs) => {
  let dateCurr = dayjs(from);
  let dateTo = dayjs(to);

  let datesBetween = [];

  while (dateCurr <= dateTo) {
    datesBetween.push(dateCurr.date());
    dateCurr = dateCurr.add(1, "day");
  }

  return datesBetween;
};
