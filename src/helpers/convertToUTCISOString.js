const convertToUTCISOString = (inputTime) => {
  return new Date(inputTime).toISOString();
};

export default convertToUTCISOString;