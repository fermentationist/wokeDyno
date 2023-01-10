// This script will run every 20 minutes to keep a heroku dyno awake and running, thereby eliminating potentially very long wait time as sleeping server restarts
// Import into main file and invoke right after starting up server, passing in the heroku url
const fetch = require("node-fetch");
const timeToNap = require("./naptime.js");

const DEFAULTS = {
  URL: "https://www.stackoverflow.com",
  INTERVAL: 1000 * 60 * 14,
  START_NAP: [0, 0, 0, 0],
  END_NAP: [0, 0, 0, 1] // default nap lasts one millisecond
}

const wokeDyno = (options) => {
  let thisTimeoutId;
  if (typeof options === "string") {
    options = {url: options};
  }
  let {url, interval, startNap, endNap} = options;
  url = typeof url === "string" ? url : DEFAULTS.URL;
  interval = typeof interval === "number" ? interval : DEFAULTS.INTERVAL;
  startNap = Array.isArray(startNap) && startNap.length === 4 ? startNap : DEFAULTS.START_NAP;
  endNap = Array.isArray(endNap) && endNap.length === 4 ? endNap : DEFAULTS.END_NAP;
  const minutes = (interval / 60000).toFixed(2);
  const minuteString = `${minutes} ${
    interval / 60000 === 1 ? "minute" : "minutes"
  }`;
  console.log(`wokeDyno called with an interval of ${minuteString}.`);
  const runTimer = (timerInterval) => {
    const timeoutFn = () => {
      timerInterval = interval; // reset to original interval, after nap
      const naptime = timeToNap(startNap, endNap, Date.now()); // if nap, will return length of nap in ms
      if (naptime) {
        const napString = `${(naptime / 60000).toFixed(2)} ${
          Math.floor(minutes) > 1 ? "minutes" : "minute"
        }`;
        console.log(`wokeDyno naptime. Napping for ${napString}...`);
        return runTimer(naptime); // take a nap
      }
      fetch(url)
        .then(() => {
          console.log(
            `Fetching ${url}. \nNext fetch request in ${minuteString}...`
          );
        })
        .catch((error) => {
          console.log(`Error fetching ${url}: ${error.message}`);
        });
      clearTimeout(thisTimeoutId);
      return runTimer(timerInterval); // run timer with original interval
    };
    thisTimeoutId = setTimeout(timeoutFn, timerInterval);
    return thisTimeoutId;
  };

  const start = () => {
    thisTimeoutId = runTimer(interval);
  };

  const stop = () => {
    clearTimeout(thisTimeoutId);
  };
  return {
    start,
    stop,
  };
};

module.exports = wokeDyno;
