/*
If current time falls between startTime and endTime, returns length startTime and endTime are arrays of numbers representing the time of day. They follow this pattern: [Hours, Minutes, Seconds, Milliseconds]. If endTime is less than startTime time, endTime will be assumed to be on the following day. 

If current time is not between startTime and endTime, will return false */
const timeToNap = (startTime, endTime, currentTimestamp) => {
  const now = new Date(currentTimestamp);
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const date = now.getUTCDate();
  const todayArray = [year, month, date];
  const startStamp = Date.UTC(...todayArray, ...startTime);
  let endStamp = Date.UTC(...todayArray, ...endTime);
  if (startStamp > endStamp) {
    if (currentTimestamp >= endStamp && currentTimestamp <= startStamp) {
      return 0;
    } else if (currentTimestamp > startStamp) {
      const tomorrowArray = [year, month, date + 1];
      endStamp = Date.UTC(...tomorrowArray, ...endTime);
    } 
    return endStamp - currentTimestamp;
  }
  if (currentTimestamp >= startStamp && currentTimestamp <= endStamp) {
    return endStamp - currentTimestamp;
  }
  return 0;
};

module.exports = timeToNap;
