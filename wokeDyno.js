// This script will run every 20 minutes to keep a heroku dyno awake and running, thereby eliminating potentially very long wait time as sleeping server restarts
// Import into main file and invoke right after starting up server, passing in the heroku url
const fetch = require("node-fetch");
const timeToNap = require("./naptime.js");

const wokeDyno = (options) => {
    let url;
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
            timerInterval = interval;// reset to original interval, after nap
            const naptime = timeToNap(startNap, endNap, new Date(Date.now())); // if nap, will return length of nap in ms
            if (naptime){
                const napString = `${(naptime / 60000).toFixed(2)} ${Math.floor(minutes) > 1 ? "minutes" : "minute"}`;
                console.log(`It's naptime! Napping for ${napString}...`);
                return runTimer(naptime); // take a nap
            }
            fetch(url)
            .then(() => console.log(`Fetching ${url}. Dyno is woke. \nNext fetch request in ${minuteString}...`))
            .catch(error => console.log(`Error fetching ${url}: ${error.message}`));
            clearTimeout(timeoutId);
            return runTimer(timerInterval); // run timer with original interval
            
        }
        const timeoutId = setTimeout(timeoutFn, timerInterval);
        return timeoutId;
    }
    const start = () => {
        try {
            return runTimer(interval);
        }
        catch (error){
            console.log("setTimeout error:", error.message);
        }
    }
    return {
        start,
        runTimer
    }
}

module.exports = wokeDyno;
