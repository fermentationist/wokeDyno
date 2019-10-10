const timeToNap = require("../naptime.js");

describe("*** naptime.js ***", () => {
	const originalDateNow = global.Date.now;
	global.Date.now = jest.fn(() => 1570505400000); // mock Date.now (~03:30 UTC)
	test("It returns *false* if now arg is not between startTime and endTime.", () => {
		
		const now = new Date(Date.now()); // ~03:30 UTC
		const before = [1, 0, 0, 0]; // 01:00 UTC
		const beforeBefore = [0, 30, 0, 0]; // 12:30 UTC
		expect(timeToNap(beforeBefore, before, now)).toBe(false);
	});
	test("If now is between startTime and endTime, it returns an integer value representing the amount of time in milliseconds between now and endTime.", () => {
		const now = new Date(Date.now()); // ~03:30 UTC
		const startNap = [1, 0, 0, 0]; // 01:00 UTC
		const endNap = [4, 30, 0, 0]; // 4:30 UTC
		expect(timeToNap(startNap, endNap, now)).toBe(3.6e6);
	});
	// global.Date.now = originalDateNow; // return normal functionality
});