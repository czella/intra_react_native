import {find, isEmpty} from 'lodash';

export const workSessionDataHelper = (data, startDate, endDate) => {
  const users = {};

  const selectedLines = [];
  const labels = [];
  const months = new Set([]);
  const years = new Set([]);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (
    const currentDate = new Date(startDate.getTime());
    currentDate < endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    labels.push(day);
    months.add(monthNames[month]);
    years.add(year);
  }
  for (const entry of data.allStatsDailyUserWorkSessions) {
    if (users[entry.UserId]) {
      continue;
    }
    selectedLines.push(entry.UserId);
    users[entry.UserId] = {
      username: entry.username,
      email: entry.userEmail,
    };
  }

  const selectedLine = selectedLines.length > 1 ? null : selectedLines[0];

  const getHoursFromMinutes = minutes => {
    let hours = minutes / 60;

    hours = Math.round(hours * 100) / 100;

    return hours;
  };

  const colors = [
    '138,43,226',
    '255,192,203',
    '0,191,255',
    '50,205,50',
    '255,165,0',
    '128,128,0',
    '64,224,208',
    '255,215,0',
    '0,255,255',
    '230,230,250',
  ];
  let lastColorIndex = null;

  const getColor = () => {
    lastColorIndex =
      lastColorIndex === null || lastColorIndex >= colors.length
        ? 0
        : lastColorIndex + 1;

    return colors[lastColorIndex];
  };
  const dataset = [];
  for (const userId in users) {
    const color = getColor();
    const userData = {
      strokeWidth: 2, // optional
      color: (opacity = 1) => `rgba(${color}, ${opacity})`,
      data: [],
    };
    for (
      const currentDate = new Date(startDate.getTime());
      currentDate < endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();

      const date =
        year +
        '-' +
        (month > 9 ? '' : '0') +
        month +
        '-' +
        (day > 9 ? '' : '0') +
        day;

      // weekends
      const newDateDay = new Date(year, currentDate.getMonth(), day).getDay();
      const stat = {
        name: day,
        isWeekend: newDateDay === 0 || newDateDay === 6,
      };

      const dataRow = find(data.allStatsDailyUserWorkSessions, function(o) {
        return o.UserId === userId && o.date === date;
      });

      userData.data.push(dataRow ? getHoursFromMinutes(dataRow.minutes) : 0);
    }
    dataset.push(userData);
  }
  if (isEmpty(dataset)) {
    const userData = {
      strokeWidth: 2, // optional
      color: (opacity = 1) => `rgba(${colors[0]}, ${opacity})`,
      data: labels.map(() => 0),
    };
    dataset.push(userData);
  }
  return {dataset: dataset, labels: labels, months: months, years: years};
};
