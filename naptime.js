/*
If current time falls between startTime and endTime, returns length startTime and endTime are arrays of numbers representing the time of day. They follow this pattern: [Hours, Minutes, Seconds, Milliseconds]. If endTime is less than startTime time, endTime will be assumed to be on the following day. 

If current time is not between startTime and endTime, will return false */
const timeToNap = (startTime, endTime, now) => { 
    const todayArray = [
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
    ];
    const start = new Date(Date.UTC(...todayArray, ...startTime));
    const end = new Date(Date.UTC(...todayArray, ...endTime));
    const finish = start < end ? end : end.setDate(end.getDate() + 1);
    if (now >= start && now <= finish){
        
        return finish - now;
    }
    return false;
}
module.exports = timeToNap;