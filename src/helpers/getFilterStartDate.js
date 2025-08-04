const getFilterStartDate = () => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() - 30);
  const dd = String(futureDate.getDate()).padStart(2, '0');
  const mm = String(futureDate.getMonth() + 1).padStart(2, '0');
  const yyyy = futureDate.getFullYear();
  const formattedDate = `${yyyy}-${mm}-${dd}`;
  return formattedDate;
};

export default getFilterStartDate;
