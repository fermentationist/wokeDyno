const fetch = require("node-fetch");
 // This script will run every 20 minutes to keep a heroku dyno awake and running, thereby eliminating potentially very long wait time as sleeping server restarts
// Import into main file and invoke right after starting up server, passing in the heroku url
const wakeUpDyno = (dynoURL, interval = 1.2e6) => {
    interval = Math.max(interval, 30000);
    setTimeout(() => { // setTimeout used instead of setInterval (safer, maybe?)
        try { 
            console.log(`setTimeout called.`);
            fetch(dynoURL).then(() => console.log(`Fetching ${dynoURL}. Dyno is woke.`));
        }
        catch (err) {
            console.log(`Error fetching ${dynoURL}`);
        }
        finally {
            return wakeUpDyno(dynoURL, interval);// recursion instead of setInterval
        }
    }, interval);
};

module.exports = wakeUpDyno;