export const dateToMysqlString = date => {
  const compensateUTCConversion = new Date(
    date.getTime() + date.getTimezoneOffset() * 60000,
  );

  return compensateUTCConversion
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d+Z$/, '');
};

export const getStartAndEndDate = referenceDate => {
  const startDate = new Date(referenceDate.getTime());
  startDate.setDate(referenceDate.getDate() - 7);
  const endDate = new Date(referenceDate.getTime());
  endDate.setDate(referenceDate.getDate() + 7);
  return {startDate: startDate, endDate: endDate};
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
