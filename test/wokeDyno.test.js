import wokeDyno from "../wokeDyno.js";
import { vi, describe, test, beforeEach, afterEach, afterAll, expect } from 'vitest';

const URL = "https://www.stackoverflow.com";

/*
  Not updating Vitest because newer versions don't allow same ability to spy on setTimeout while using fake timers
*/

//utility functions
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

//mocks
vi.stubGlobal('fetch', vi.fn(() => Promise.resolve()));
const fetch = global.fetch;

let timeoutSpy;

beforeEach(() => {
  vi.useFakeTimers();
  timeoutSpy = vi.spyOn(global, "setTimeout");
});

afterEach(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
});

afterAll(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("*** Timing tests - wokeDyno ***", () => {
  
  const testWakeUpDyno = (numIntervals) => {
    expect(setTimeout).toHaveBeenCalledTimes(numIntervals + 1);
    expect(setTimeout).toHaveReturnedTimes(numIntervals + 1);
    expect(fetch).toHaveBeenCalledTimes(numIntervals);
    expect(fetch).toHaveReturnedTimes(numIntervals);
    expect(fetch).toHaveBeenCalledWith(URL);
  };

  test("Runs with default settings, if invoked with no options", () => {
    const numIntervals = randomInt(10, 100);
    const defaultInterval = 1000 * 60 * 14; // 14 minutes
    const defaultUrl = "https://stackoverflow.com";
    const wakeUpDyno = wokeDyno();
    wakeUpDyno.start();
    vi.advanceTimersByTime(defaultInterval * numIntervals);
    expect(setTimeout).toHaveBeenCalledTimes(numIntervals + 1);
    expect(fetch).toHaveBeenCalledTimes(numIntervals);
    expect(fetch).toHaveBeenCalledWith(defaultUrl);
    wakeUpDyno.stop();
  })

  test("Calls fetch and setTimeout once per interval when not napping, until stop() is called.", () => {
    const randomInterval = randomInt(0, 1.5e6);
    const numIntervals = randomInt(10, 100);
    const wakeUpDyno = wokeDyno({ url: URL, interval: randomInterval });
    wakeUpDyno.start();
    vi.advanceTimersByTime(randomInterval * numIntervals);
    testWakeUpDyno(numIntervals);
    vi.advanceTimersByTime(randomInterval * numIntervals);
    testWakeUpDyno(numIntervals * 2);
    wakeUpDyno.stop();
    vi.advanceTimersByTime(randomInterval * numIntervals);
    testWakeUpDyno(numIntervals * 2); // fetch and setTimeout will not have been called any additional times, despite advancing timers, because it is stopped.
  });

  test("Calls setTimeout once and fetch zero times while napping, then resumes making fetch requests after nap.", () => {
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
    vi.advanceTimersByTime(45 * 1000); // after interval, but before nap is over
		expect(setTimeout).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledTimes(0);
    vi.advanceTimersByTime(15 * 1000); // after nap
    expect(setTimeout).toHaveBeenCalledTimes(3);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveReturnedTimes(1);
    expect(fetch).toHaveBeenCalledWith(URL);
    wakeUpDyno.stop();
  });

  test("Calls setTimeout once and fetch zero times while napping, then resumes making fetch requests after nap. (with startNap *after* endNap)", () => {
    const interval = 1000 * 60 * 45; // 45 minutes
		const now = new Date();
		const hours = now.getUTCHours();
		const mins = now.getUTCMinutes();
    const secs = now.getUTCSeconds();
    const ms = now.getUTCMilliseconds();
		const endNap = [hours + 1, mins, secs, ms]; // one hour from now
		const startNap = [hours + 2, mins, secs, ms]; // one hour after endNap
    const wakeUpDyno = wokeDyno({
      url: URL,
      interval,
      startNap,
      endNap,
    });
    wakeUpDyno.start();
    vi.advanceTimersByTime(1000 * 60 * 40); // before interval is over
    expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(1000 * 60 * 5); // after interval, but before nap is over
		expect(setTimeout).toHaveBeenCalledTimes(2);
		expect(fetch).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(1000 * 60 * 15); // after nap
    expect(setTimeout).toHaveBeenCalledTimes(3);
    expect(fetch).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000 * 60 * 60); // nap begins again
    expect(setTimeout).toHaveBeenCalledTimes(4);
    expect(fetch).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(1000 * 60 * 30); // next interval
    expect(setTimeout).toHaveBeenCalledTimes(5);
    expect(fetch).toHaveBeenCalledTimes(2); 

    vi.advanceTimersByTime(1000 * 60 * 60 * 22.5); // next interval, end of nap
    expect(setTimeout).toHaveBeenCalledTimes(6);
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(fetch).toHaveReturnedTimes(3);
    expect(fetch).toHaveBeenCalledWith(URL);
    wakeUpDyno.stop();
  });
});
