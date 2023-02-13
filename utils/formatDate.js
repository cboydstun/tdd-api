const formatDate = (date) => {
    const newDate = new Date(date);
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    const year = newDate.getFullYear();
    return `${month}/${day}/${year}`;
};

module.exports = { formatDate };