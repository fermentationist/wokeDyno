const fetch = require("node-fetch");
 // This script will run every 5 minutes to keep a heroku dyno awake and running, thereby eliminating potentially very long wait time as sleeping server restarts
// Import into main file and invoke right after starting up express app, passing in the heroku url
const wakeUpDyno = (dynoURL, interval = 300000) => {
    setInterval(() => {
        interval = Math.max(interval, 30000);
        try { 
            console.log(`setInterval called. Will fetch ${dynoURL}.`);
            fetch(dynoURL, () => console.log(`Fetching ${dynoURL}. Dyno is woke.`));
        }
        catch (err) {
            console.log(`Error fetching ${dynoURL}`);
        }
    }, interval);
};

module.exports = wakeUpDyno;