const timeToNap = require("../naptime.js");

describe("*** naptime.js ***", () => {
	// const originalDateNow = global.Date.now;
	// global.Date.now = jest.fn(() => 1570505400000); // mock Date.now (~03:30 UTC)
	test("It returns 0 if currentTimestamp arg is not between startTime and endTime.", () => {
		const now = new Date();
		const hours = now.getUTCHours();
		const startNap = [hours + 1, 0, 0, 0]; // after now
		const endNap = [hours + 2, 0, 0, 0];  // after startNap
		expect(timeToNap(startNap, endNap, now.getTime())).toBe(0);
	});

	test("If now is between startTime and endTime, it returns an integer value representing the amount of time in milliseconds between now and endTime.", () => {
		const now = new Date();
		const hours = now.getUTCHours();
		const mins = now.getUTCMinutes();
		const secs = now.getUTCSeconds();
		const ms = now.getUTCMilliseconds();
		const startNap = [hours, 0, 0, 0]; // now or before now
		const endNap = [hours + 1, mins, secs, ms]; // after now
		expect(timeToNap(startNap, endNap, now.getTime())).toBe(1000 * 60 * 60);
	});

	test("If startTime is after endTime, nap is assumed to extend overnight and into the next day (now before endTime)", async () => {
		const now = new Date();
		const hours = now.getUTCHours();
		const mins = now.getUTCMinutes();
		const secs = now.getUTCSeconds();
		const ms = now.getUTCMilliseconds();
		const endNap = [hours + 1, mins, secs, ms]; // after now
		const startNap = [hours + 2, mins, secs, ms]; // startNap after endNap
		expect(timeToNap(startNap, endNap, now.getTime())).toBe(1000 * 60 * 60); // 1 hour
	});

	test("If startTime is after endTime, nap is assumed to extend overnight and into the next day (now after startTime)", async () => {
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