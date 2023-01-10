// This script will run every 20 minutes to keep a heroku dyno awake and running, thereby eliminating potentially very long wait time as sleeping server restarts
// Import into main file and invoke right after starting up server, passing in the heroku url
const fetch = require("node-fetch");
const timeToNap = require("./naptime.js");

const wokeDyno = (options) => {
    let url;
    let thisTimeoutId;
    if (typeof options === "string") {
        url = options;
    } else {
        url = options.url;
    }
    let interval = options.interval || 1.5e6;
    let startNap = options.startNap || [0, 0, 0, 0];
    let endNap = options.endNap || [0, 0, 0, 1];
    const minutes = (interval / 60000).toFixed(2);
    const minuteString = `${minutes} ${(interval / 60000) === 1 ? "minute" : "minutes"}`;
    console.log(`wokeDyno called with an interval of ${minuteString}.`);
    const runTimer = (timerInterval) => {
        const timeoutFn = () => {
            console.log(`timeoutFn returning from ${timerInterval} timeout`)
            timerInterval = interval;// reset to original interval, after nap
            const naptime = timeToNap(startNap, endNap, Date.now()); // if nap, will return length of nap in ms
            console.log("Date.now()", Date.now())
            console.log("naptime:", naptime)
            if (naptime){
                const napString = `${(naptime / 60000).toFixed(2)} ${Math.floor(minutes) > 1 ? "minutes" : "minute"}`;
                console.log(`wokeDyno naptime. Napping for ${napString}...`);
                return runTimer(naptime); // take a nap
            }
            fetch(url)
            .then(() => console.log(`Fetching ${url}. \nNext fetch request in ${minuteString}...`))
            .catch(error => console.log(`Error fetching ${url}: ${error.message}`));
            clearTimeout(thisTimeoutId);
            return runTimer(timerInterval); // run timer with original interval
            
        }
        thisTimeoutId = setTimeout(timeoutFn, timerInterval);
        return thisTimeoutId;
    }
    // const start = () => {
    //     try {
    //         return runTimer(interval);
    //     }
    //     catch (error){
    //         console.log("setTimeout error:", error.message);
    //     }
    // }

    const start = () => new Promise((resolve, reject) => {
        try {
            thisTimeoutId = runTimer(interval);
            return resolve(thisTimeoutId);
        }
        catch (error) {
            console.error("wokeDyno error:", error);
            return reject(error);
        }
    });

    const stop = () => {
        clearTimeout(thisTimeoutId);
    }
    return {
        start,
        stop
    }
}

module.exports = wokeDyno;
