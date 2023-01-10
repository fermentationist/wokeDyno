const wokeDyno = require("../wokeDyno.js");

const URL = "https://www.stackoverflow.com";

/*
  Not updating Jest because newer versions don't allow same ability to spy on setTimeout while using fake timers
*/

//utility functions
const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

//mocks
jest.mock("node-fetch");
const fetch = require("node-fetch");
fetch.mockImplementation(() => Promise.resolve()); // mock node-fetch

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

test("Calls fetch and setTimeout once per interval when not napping, until stop() is called.", () => {
    const randomInterval = randomInt(0, 1.5e6);
    const numIntervals = randomInt(10, 100);
    const wakeUpDyno = wokeDyno({ url: URL, interval: randomInterval });
    wakeUpDyno.start();
    jest.advanceTimersByTime(randomInterval * numIntervals);
    testWakeUpDyno(numIntervals);
    jest.advanceTimersByTime(randomInterval * numIntervals);
    testWakeUpDyno(numIntervals * 2);
    wakeUpDyno.stop();
    jest.advanceTimersByTime(randomInterval * numIntervals);
    testWakeUpDyno(numIntervals * 2); // fetch and setTimeout will not have been called any additional times, despite advancing timers, because it is stopped.
  });

  test("Calls setTimeout once and fetch zero times while napping.", () => {
    const interval = 45000;
		const now = new Date();
		const hours = now.getUTCHours();
		const mins = now.getUTCMinutes();
    const secs = now.getUTCSeconds();
    const ms = now.getUTCMilliseconds();
		const startNap = [hours, mins, 0, 0]; // before now
		const endNap = [hours, mins + 1, secs, ms]; // after now
    const wakeUpDyno = wokeDyno({
      url: URL,
      interval,
      startNap,
      endNap,
    });
    wakeUpDyno.start();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(45 * 1000); // after interval, but before nap is over
		expect(setTimeout).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledTimes(0);
    // jest.advanceTimersByTime() does not affect Date.now() in tested function, so it cannot be used to test if nap ends at correct time
    wakeUpDyno.stop();
  });

  test("Calls setTimeout once and fetch zero times while napping. Then calls fetch once after nap. (real time test, with startNap *before* endNap)", async () => {
    jest.useRealTimers();
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");
    const interval = 750;
		const now = new Date();
		const hours = now.getUTCHours();
		const mins = now.getUTCMinutes();
    const secs = now.getUTCSeconds();
    const ms = now.getUTCMilliseconds();
		const startNap = [hours, mins, 0, 0]; // now or before now
		const endNap = [hours, mins, secs + 1, ms]; // one second from now
    const wakeUpDyno = wokeDyno({
      url: URL,
      interval,
      startNap,
      endNap,
    });
    wakeUpDyno.start();
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    await sleep(250); // before interval is over
		expect(setTimeoutSpy).toHaveBeenCalledTimes(2); // "sleep" helper function calls setTimeout once each time it is invoked
		expect(fetch).toHaveBeenCalledTimes(0);
    await sleep(500); // after interval is over, but before nap is over
		expect(setTimeoutSpy).toHaveBeenCalledTimes(4);
		expect(fetch).toHaveBeenCalledTimes(0);
    await sleep(250); // after nap is over
    expect(setTimeoutSpy).toHaveBeenCalledTimes(6);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveReturnedTimes(1);
    expect(fetch).toHaveBeenCalledWith(URL);
    wakeUpDyno.stop();
  });

  test("Calls setTimeout once and fetch zero times while napping. Then calls fetch once after nap. (real time test, with startNap *after* endNap)", async () => {
    jest.useRealTimers();
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");
    const interval = 750;
		const now = new Date();
		const hours = now.getUTCHours();
		const mins = now.getUTCMinutes();
    const secs = now.getUTCSeconds();
    const ms = now.getUTCMilliseconds();
		const endNap = [hours, mins, secs + 1, ms]; // one second from now
		const startNap = [hours, mins, secs + 2, ms]; // now or before now
    const wakeUpDyno = wokeDyno({
      url: URL,
      interval,
      startNap,
      endNap,
    });
    wakeUpDyno.start();
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    await sleep(250); // before interval is over
		expect(setTimeoutSpy).toHaveBeenCalledTimes(2); // "sleep" helper function calls setTimeout once each time it is invoked
		expect(fetch).toHaveBeenCalledTimes(0);
    await sleep(500); // after interval is over, but before nap is over
		expect(setTimeoutSpy).toHaveBeenCalledTimes(4);
		expect(fetch).toHaveBeenCalledTimes(0);
    await sleep(250); // after nap is over
    expect(setTimeoutSpy).toHaveBeenCalledTimes(6);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveReturnedTimes(1);
    expect(fetch).toHaveBeenCalledWith(URL);
  });
});
