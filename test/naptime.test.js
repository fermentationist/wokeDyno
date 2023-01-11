const timeToNap = require("../naptime.js");

describe("*** naptime.js ***", () => {
	
  test("It returns 0 if currentTimestamp arg is not between startTime and endTime.", () => {
    const now = new Date();
    const hours = now.getUTCHours();
    const startNap = [hours + 1, 0, 0, 0]; // after now
    const endNap = [hours + 2, 0, 0, 0]; // after startNap
    expect(timeToNap(startNap, endNap, now.getTime())).toBe(0);
  });

  test("If endTime is after startTime and now is between startTime and endTime, it returns an integer value representing the amount of time in milliseconds between now and endTime.", () => {
    const now = new Date();
    const hours = now.getUTCHours();
    const mins = now.getUTCMinutes();
    const secs = now.getUTCSeconds();
    const ms = now.getUTCMilliseconds();
    const startNap = [hours, 0, 0, 0]; // now or before now
    const endNap = [hours + 1, mins, secs, ms]; // after now
    expect(timeToNap(startNap, endNap, now.getTime())).toBe(1000 * 60 * 60);
  });

  test("If endTime is before startTime, and now is before endTime, nap is assumed to be extended overnight from the previous day, and it returns the amount of time between now and endTime (today)", async () => {
    const now = new Date();
    const hours = now.getUTCHours();
    const mins = now.getUTCMinutes();
    const secs = now.getUTCSeconds();
    const ms = now.getUTCMilliseconds();
    const endNap = [hours + 1, mins, secs, ms]; // after now
    const startNap = [hours + 2, mins, secs, ms]; // startNap after endNap
    expect(timeToNap(startNap, endNap, now.getTime())).toBe(1000 * 60 * 60); // 1 hour
  });

  test("If endTime is before startTime, and now is after startTime, nap is assumed to extend overnight and into the next day, and it returns the amount of time between now and endTime (tomorrow)", async () => {
    const start = new Date();
    const year = start.getUTCFullYear();
    const month = start.getUTCMonth();
    const date = start.getUTCDate();
    const hours = start.getUTCHours();
    const mins = start.getUTCMinutes();
    const secs = start.getUTCSeconds();
    const ms = start.getUTCMilliseconds();
    const endNap = [hours, mins, secs, ms]; // before startNap
    const startNap = [hours + 1, mins, secs, ms]; // startNap after endNap
    const now = Date.UTC(year, month, date, hours + 2, mins, secs, ms); // after startNap
    expect(timeToNap(startNap, endNap, now)).toBe(1000 * 60 * 60 * 22); // 22 hours
  });
});
