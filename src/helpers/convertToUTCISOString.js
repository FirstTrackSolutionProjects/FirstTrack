const convertToUTCISOString = (inputTime) => {
  const date = new Date(inputTime);
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return utcDate.toISOString();
};

export default convertToUTCISOString;