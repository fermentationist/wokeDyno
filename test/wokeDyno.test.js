const wokeDyno = require("../wokeDyno.js");
const timeToNap = require("../naptime.js");

const URL = "https://www.stackoverflow.com";

//utility functions
const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

//mocks
jest.mock("node-fetch");
const fetch = require("node-fetch");
fetch.mockImplementation(() => Promise.resolve()); // mock node-fetch

global.Date.now = jest.fn(() => 1570505400000); // mock Date.now (~03:30 UTC)

beforeEach(() => {
  jest.useFakeTimers(); // mock setTimeout
});

afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

afterAll(() => {
  fetch.mockRestore();
  jest.useRealTimers();
});

describe("*** Timing tests - wokeDyno ***", () => {
  const testWakeUpDyno = (numIntervals) => {
    expect(setTimeout).toHaveBeenCalledTimes(numIntervals + 1);
    expect(setTimeout).toHaveReturnedTimes(numIntervals + 1);
    expect(fetch).toHaveBeenCalledTimes(numIntervals);
    expect(fetch).toHaveReturnedTimes(numIntervals);
    expect(fetch).toHaveBeenCalledWith(URL);
  };

  test("Calls fetch and setTimeout once per interval when not napping.", async () => {
    const randomInterval = randomInt(0, 1.5e6);
    const numIntervals = randomInt(10, 100);
    const wakeUpDyno = wokeDyno({ url: URL, interval: randomInterval });
    await wakeUpDyno.start();
    jest.advanceTimersByTime(randomInterval * numIntervals);
    testWakeUpDyno(numIntervals);
  });

  test("Calls fetch and setTimeout once per interval until stop() is called.", async () => {
    const randomInterval = randomInt(0, 1.5e6);
    const numIntervals = randomInt(10, 100);
    const wakeUpDyno = wokeDyno({ url: URL, interval: randomInterval });
    await wakeUpDyno.start();
    jest.advanceTimersByTime(randomInterval * numIntervals);
    testWakeUpDyno(numIntervals);
    wakeUpDyno.stop();
    const before = Date.now();
    jest.advanceTimersByTime(randomInterval * numIntervals);
    expect(before).toBe(Date.now());
    testWakeUpDyno(numIntervals); // fetch and setTimeout will not have been called any additional times, despite advancing timers, because it is stopped.
    console.log("end of test");
  });

  test("Calls setTimeout once and fetch zero times while napping.", async () => {
    const interval = 45000;
		const now = new Date();
		const hours = now.getUTCHours();
		const mins = now.getUTCMinutes();
		const startNap = [hours, mins, 0, 0];
		const endNap = [hours, mins, 59, 999]
    const wakeUpDyno = wokeDyno({
      url: URL,
      interval,
      startNap,
      endNap,
    });
    await wakeUpDyno.start();
    jest.advanceTimersByTime(58 * 1000);
		expect(setTimeout).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledTimes(0);
		jest.advanceTimersByTime(2000);
		expect(setTimeout).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledTimes(1);
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
