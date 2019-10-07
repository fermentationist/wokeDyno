// This script will run every 20 minutes to keep a heroku dyno awake and running, thereby eliminating potentially very long wait time as sleeping server restarts
// Import into main file and invoke right after starting up server, passing in the heroku url
const fetch = require("node-fetch");
const timeToNap = require("./naptime.js");

const wakeUpDyno = ({
    url, 
    interval = 1.5e6, 
    startNap = [5,0,0,0], 
    endNap = [10,0,0,0]
}) => {
    const now = new Date(Date.now());
    const minutes = (interval / 60000).toFixed(2);
    const minuteString = `${minutes} ${(interval / 60000) === 1 ? "minute" : "minutes"}`;
    console.log(`wokeDyno interval: ${minuteString}`);
    const runTimer = timerInterval => {
        const timeoutFn = () => {
            clearTimeout(timeoutId);
            timerInterval = interval;// reset to original interval, after nap
            const naptime = timeToNap(startNap, endNap, now); // if nap, will return length of nap in ms
            if (naptime){
                const napString = `${(naptime / 60000).toFixed(2)} ${Math.floor(minutes) > 1 ? "minutes" : "minute"}`;
                console.log(`It's naptime! Napping for ${napString}...`);
                return runTimer(naptime); // take a nap
            }
            fetch(url)
            .then(() => console.log(`Fetching ${url}. Dyno is woke. \nNext fetch request in ${minuteString}...`))
            .catch(error => console.log(`Error fetching ${url}: ${error.message}`));

            return runTimer(timerInterval); // run timer with original interval
            
        }
        const timeoutId = setTimeout(timeoutFn, timerInterval);
    }
    try {
        runTimer(interval);
    }
    catch (error){
        console.log("setTimeout error:", error.message);
    }
}

module.exports = wakeUpDyno;
