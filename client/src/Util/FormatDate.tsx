const formatDate = (date: any): string => {
  return Object.keys(date)
    .filter((x) => ["day", "month", "year"].includes(x))
    .map((x) => date[x].toString().padStart(2, "0"))
    .join("-");
};

export default formatDate;
