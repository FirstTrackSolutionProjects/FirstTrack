const convertUTCToIST = (utcTimestamp) => {
  const utcDate = new Date(utcTimestamp);

  const istOffset = 330 * 60 * 1000;

  const istDate = new Date(utcDate.getTime() + istOffset);
  return istDate;
}

export default convertUTCToIST;