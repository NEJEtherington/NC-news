const formatDate = timeStamp => {
  return new Date(timeStamp);
};

const formatDataForTimeStamp = data => {
  const formattedData = data.map(item => {
    const { created_at, ...restOfData } = item;
    const convertedDate = formatDate(item.created_at);
    return { ...restOfData, created_at: convertedDate };
  });
  return formattedData;
};

module.exports = { formatDataForTimeStamp };
