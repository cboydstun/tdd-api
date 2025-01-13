// Date formate 2023-04-23
const formatDate = (date, timeZone) => {
  const newDate = new Date(date).toLocaleDateString("en-US", { timeZone });
  const [month, day, year] = newDate.split("/");
  return `${year}-${month.padStart(2, "0")}-${(day + 1).padStart(2, "0")}`;
};

module.exports = { formatDate };
