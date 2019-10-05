// This script will run every 20 minutes to keep a heroku dyno awake and running, thereby eliminating potentially very long wait time as sleeping server restarts
// Import into main file and invoke right after starting up server, passing in the heroku url
const fetch = require("node-fetch");

const wakeUpDyno = ({
    url, 
    interval = 1.5e6, 
    startNap = [22,0,0,1], 
    endNap = [23,59,59,999], 
    callback
}) => {
    const minutes = (interval / 60000).toFixed(3);
    console.log("TCL: minutes", minutes)
    try {
        const currentTimer = setTimeout(() => {
            try { 
                const naptime = timeToNap(startNap, endNap);
                if (naptime){// fetch only during allowed hours
                    console.log(`It's naptime! Napping for ${(naptime / 60000).toFixed(2)} minutes...`, naptime);
                    currentTimer.refresh();
                    // clearTimeout(currentTimer);
                    return wakeUpDyno({url, interval: naptime, startNap, endNap, callback});
                }
                fetch(url).then(() => console.log(`Fetching ${url}. Dyno is woke. \nNext fetch request in ${minutes} minutes...`)); // HTTP GET request to the dyno's url
            }
            catch (err) { // catch fetch errors
                console.log(`Error fetching ${url}: ${err.message} \nWill try again in ${minutes} minutes...`);
            }
            finally {

                try {
                    callback(); // execute callback, if passed
                }
                catch (e) { // catch callback error
                    callback ? console.log("Callback failed: ", e.message) : null;
                }
                finally {
                    currentTimer.refresh();
                    return wakeUpDyno({url, interval, startNap, endNap, callback});// do it all again
                }
                
            }
        }, interval);
    }
    catch(error){
        console.log(`Error executing setTimeout: ${err.message}`);
    }
};

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


wakeUpDyno({url:"https://google.com", interval: 20000, startNap: [4,52,0,0], endNap: [4,54,0,666]});