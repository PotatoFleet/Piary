const formatDate = (date: any): string => {
  return Object.keys(date)
    .filter((x) => ["day", "month", "year"].includes(x))
    .map((x) => date[x].pad(0, 2))
    .join("-");
};

export default formatDate;
