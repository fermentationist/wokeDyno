"use strict";
const wokeDyno = require("../wokeDyno.js");
const timeToNap = require("../naptime.js");

jest.mock("node-fetch");
const fetch = require("node-fetch");
fetch.mockImplementation(() => Promise.resolve()); // mock node-fetch
const originalDateNow = global.Date.now;
global.Date.now = jest.fn(() => 1570505400000); // mock Date.now (~03:30 UTC)
jest.useFakeTimers(); // mock setTimeout

const URL = "https://www.stackoverflow.com";

describe("*** Timing tests - wokeDyno ***", () => {
	const randomInterval = Math.floor(Math.random() * 1.5e6); //random int between 0 and 1.5e6
	test("It calls setTimeout once per interval when not napping.", (done) => {
		jest.clearAllMocks();
		
		const wakeUpDyno = wokeDyno({url:URL, interval: randomInterval});
		expect(setTimeout).not.toHaveBeenCalled();
		wakeUpDyno.start();
		jest.advanceTimersByTime(randomInterval * 12);
		expect(setTimeout).toHaveBeenCalledTimes(13);
		expect(setTimeout).toHaveReturnedTimes(13);
		done();
		jest.clearAllTimers();
	});
	test("It makes a fetch request to the URL once per interval when not napping.", (done) => {
		jest.clearAllMocks();
		
		const wakeUpDyno = wokeDyno({url:URL, interval: randomInterval});
		wakeUpDyno.start();
		expect(fetch).not.toHaveBeenCalled();
		jest.advanceTimersByTime(randomInterval * 12);
		expect(fetch).toHaveBeenCalledTimes(12);
		expect(fetch).toHaveReturnedTimes(12);
		expect(fetch).toHaveBeenCalledWith(URL);
		done();
		jest.clearAllTimers();
	});
});

// describe("*** nap scheduling - wokeDyno ***", () => {
// 	const randomInterval = Math.floor(Math.random() * 1.5e6); //random int between 0 and 1.5e6
// 	jest.clearAllMocks();
// 	test("During naptime, calls setTimeout once per interval.", (done) => {
		
// 		const wakeUpDyno = wokeDyno({URL, interval: randomInterval, startNap: []});
// 		wakeUpDyno.start();
		
// 		jest.advanceTimersByTime(randomInterval * 12)
// 		// expect(setTimeout).toHaveBeenCalledTimes(13);
// 		// expect(fetch).not.toHaveBeenCalled();
// 		done();
// 		jest.clearAllTimers();
// 	});
// });

// describe("*** nap scheduling - wokeDyno ***", () => {
// 	const randomInterval = Math.floor(Math.random() * 1.5e6); //random int between 0 and 1.5e6
// 	jest.clearAllMocks();
// 	test("During naptime, does not make fetch calls.", (done) => {
		
// 		const wakeUpDyno = wokeDyno({URL, interval: randomInterval});
// 		wakeUpDyno.start();
		
// 		jest.advanceTimersByTime(randomInterval * 12)
// 		// expect(fetch).not.toHaveBeenCalled();
// 		done();
// 		jest.clearAllTimers();
// 	});
// });

describe("*** naptime.js ***", () => {
	// const originalDateNow = global.Date.now;
	// global.Date.now = jest.fn(() => 1570505400000); // mock Date.now (~03:30 UTC)
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