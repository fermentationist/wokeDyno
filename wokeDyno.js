// This script will run every 20 minutes to keep a heroku dyno awake and running, thereby eliminating potentially very long wait time as sleeping server restarts
// Import into main file and invoke right after starting up server, passing in the heroku url
const fetch = require("node-fetch");

const wakeUpDyno = ({
    url,
    interval,
    startNap,
    endNap
}) => {
    const timeoutFn = () => {
        const naptime = timeToNap(startNap, endNap);
        if (naptime){
            console.log(`It's naptime! Napping for ${(naptime / 60000).toFixed(2)} minutes...`, naptime);
        }
        if (!naptime){
            fetch(url).then(() => console.log(`Fetching ${url}. Dyno is woke. \nNext fetch request in ${(interval / 60000).toFixed(2)} minutes...`));
        }
        return wakeUpDyno({url, interval, startNap, endNap})
    }
    const timeoutId = setTimeout(timeoutFn, interval);
}
/*
If current time falls between startTime and endTime, returns length startTime and endTime are arrays of numbers representing the time of day. They follow this pattern: [Hours, Minutes, Seconds, Milliseconds]. If endTime is less than startTime time, endTime will be assumed to be on the following day. 

If current time is not between startTime and endTime, will return false */
const timeToNap = (startTime, endTime) => { 
    const now = new Date(Date.now());
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

module.exports = wakeUpDyno;


wakeUpDyno({url:"https://google.com", interval: 7000, startNap: [1,42,0,0], endNap: [1,44,0,666]});