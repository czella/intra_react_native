export const dateToMysqlString = date => {
  const compensateUTCConversion = new Date(
    date.getTime() + date.getTimezoneOffset() * 60000,
  );

  return compensateUTCConversion
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d+Z$/, '');
};

export const getDateFilters = (startDate, endDate) => {
  const filters = [];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  for (
    const currentDate = new Date(startDate.getTime());
    currentDate < endDate;
    currentDate.setMonth(currentDate.getMonth() + 1)
  ) {
    const monthStartDate = new Date(currentDate.getTime());
    const monthEndDate = new Date(monthStartDate.getTime());
    monthEndDate.setMonth(monthEndDate.getMonth() + 1);

    filters.push({
      label: currentDate.getFullYear() + ' ' + months[currentDate.getMonth()],
      year: currentDate.getFullYear(),
      monthIndex: currentDate.getMonth(),
    });
  }
  return filters;
};

export const getWeekCount = (year, monthNumber) => {
  const firstOfMonth = new Date(year, monthNumber, 1);
  const lastOfMonth = new Date(year, monthNumber + 1, 0);
  return getWeekNumber(lastOfMonth) - getWeekNumber(firstOfMonth) + 1;
};

const getWeekNumber = d => {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  // Return array of year and week number
  return weekNo;
};

export const getTodaysMonthWeekNumber = () => {
  const currentDate = getTodaysUTCDate();
  const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(),currentDate.getMonth(), 1);
  return getWeekNumber(currentDate) - getWeekNumber(firstDayOfCurrentMonth) + 1;
};

export const getFirstDayOfWeek = (year, month, week) => {
  const firstOfMonthDate = new Date(year, month, 1);
  if (week === 1) {
    return firstOfMonthDate;
  }
  const delay = (week - 1) * 7;
  const distanceFromMonday = (firstOfMonthDate.getDay() || 7) - 1;
  return new Date(
    year,
    month,
    firstOfMonthDate.getDate() + delay - distanceFromMonday,
  );
};

export const getLastDayOfWeek = (year, month, week) => {
  const firstOfMonthDate = new Date(year, month, 1);
  const delay = (week - 1) * 7;
  const distanceFromSunday = 7 - (firstOfMonthDate.getDay() || 7);
  const lastDayOfWeek = new Date(
    year,
    month,
    firstOfMonthDate.getDate() + delay + distanceFromSunday + 1,
  );
  if (lastDayOfWeek.getMonth() !== month) {
    return new Date(year, month + 1, 0);
  }
  return lastDayOfWeek;
};

export const getTodaysUTCDate = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
  return date;
};
