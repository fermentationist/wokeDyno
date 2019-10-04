// This script will run every 20 minutes to keep a heroku dyno awake and running, thereby eliminating potentially very long wait time as sleeping server restarts
// Import into main file and invoke right after starting up server, passing in the heroku url
const fetch = require("node-fetch");

const wakeUpDyno = ({
    url, 
    interval = 25, 
    start = [22,0,0,1], 
    end = [23,59,59,999], 
    callback
}) => {
    const milliseconds = interval * 60000;
    try {
        setTimeout(() => {
            try { 
                console.log(`setTimeout called.`);
                if (nowIsBetween(start, end)){// fetch only during allowed hours
                    fetch(url).then(() => console.log(`Fetching ${url}. Dyno is woke.`)); // HTTP GET request to the dyno's url
                }
            }
            catch (err) { // catch fetch errors
                console.log(`Error fetching ${url}: ${err.message} \nWill try again in ${interval} minutes...`);
            }
            finally {

                try {
                    callback(); // execute callback, if passed
                }
                catch (e) { // catch callback error
                    callback ? console.log("Callback failed: ", e.message) : null;
                }
                finally {
                    return wakeUpDyno(url, interval, start, end, callback);// do it all again
                }
                
            }
        }, milliseconds);
    }
    catch(error){
        console.log(`Error executing setTimeout: ${err.message}`);
    }
};

/*
Returns true if current time falls between begin and end. begin and end are arrays of numbers representing the time. They follow this pattern: [Hours, Minutes, Seconds, Milliseconds]. If end time is less than begin time, end will be assumed to be on the following day. */
const nowIsBetween = (beginTime, endTime) => { 
    const now = new Date(Date.now());
    const todayArray = [
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    ];
    const begin = new Date(Date.UTC(...todayArray, ...beginTime));
    const end = new Date(Date.UTC(...todayArray, ...endTime));
    const finish = begin < end ? end : end.setDate(end.getDate() + 1);

    //     let finish = start <= end[i] ? end[i] : end[i] + 24;// to account 
    return now >= start && now <= finish;
}

module.exports = wakeUpDyno;

// wakeUpDyno("https://dennis-hodges.com", 0.125, [11,0,0,0], [5,0,0,0]);
wakeUpDyno({url:"https://google.com", interval: 0.125});
// console.log(nowIsBetween([5,0,0,0], [11,0,0,0]))