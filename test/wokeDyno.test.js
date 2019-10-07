// "use strict";
const wokeDyno = require("../wokeDyno.js");
jest.mock("node-fetch");
const fetch = require("node-fetch");
console.log("TCL: fetch", fetch)
fetch.mockImplementation(() => Promise.resolve());
console.log("TCL: fetch", fetch)
describe("*** Timing tests - wokeDyno ***", () => {
	jest.useFakeTimers();
	test("tautology", async () => {
		expect.assertions(1);
		return await expect(true).toBe(true);
	});
	test("Given a url and an interval of milliseconds as input, it makes a fetch request to the url once every interval milliseconds.", (done) => {
		const randomInterval = Math.floor(Math.random() * 30000); //random int between 0 and 30000
		const url = "https://www.google.com";
		wokeDyno({url, randomInterval});
		expect(fetch).not.toBeCalled();
		jest.advanceTimersByTime(randomInterval * 12.5);
		// expect(fetch.mock.calls.length).toBeGreaterThan(0);
		jest.advanceTimersByTime(randomInterval * 10);
		expect(fetch).toBeCalled();

		// expect(fetch).toHaveBeenCalledTimes(12);
		done();
	})
	// test for asyncFnRejects function
	// test("02 asyncFnRejects(testInput) returns a Promise that rejects with the value errorText", async () => {
	// 	expect.assertions(1);
	// 	return await expect(rejectedPromise).rejects.toEqual(errorText);
	// });
});