# woke-dyno

There are some hosting services like Render.com that will allow you to host a server for free, but with some limitations. If it does not receive any web traffic for a set period of time, your free server will be put to sleep, leaving the next user to visit with a possibly long wait time (up to thirty seconds!) as your server starts up again. This is long enough for many users to assume the site is broken and move on. **woke-dyno** is a tiny utility to prevent your server from sleeping when not in use. 

**woke-dyno** will perform a simple HTTP request to whatever url you provide, at regular intervals. If you use the url of your free server, that single GET request will be sufficient to prevent it from going dormant, so that visitors will not be made to endure unreasonably long loading times.

---
## Installation
To install with **npm**:
```bash
npm install --save woke-dyno
```
To install with **Yarn**:
```bash
yarn add woke-dyno
```
---
## Use
Import the default export from **woke-dyno** (a function) and invoke it with the url of your server as an argument. Call the `.start()` method on the returned object to start **woke-dyno**:

```javascript
/* Example: as used with an Express app */

import express from "express";
import wokeDyno from "woke-dyno";

const SELF_URL = "https://hotdogisasandwich.com"; // the URL of the server to keep awake

// create an Express app
const app = express();

...

// configure wokeDyno
const dynoWaker = wokeDyno(SELF_URL);

// start the server, then start wokeDyno
app.listen(PORT, () => {
    dynoWaker.start();
});

```
---
## Options

By default, **woke-dyno** will make its HTTP request once every 14 minutes, with no naptime.  By passing an options object, instead of a string, you can change the default settings:

```javascript
/* Example: with custom options */

...

// configure wokeDyno
const dynoWaker = wokeDyno({
  url: SELF_URL,  // url string
  interval: 1000 * 60 * 20, // interval in milliseconds (20 minutes in this example)
  startNap: [5, 0, 0, 0], // the time to start nap in UTC, as [h, m, s, ms] (05:00 UTC in this example)
  endNap: [9, 59, 59, 999] // time to wake up again, in UTC (09:59:59.999 in this example)
});

// start the server, then start wokeDyno
app.listen(PORT, () => {
  dynoWaker.start(); 
});
```

* **`url`** (String): The URL of the server to wake
* **`interval`** (Number): The interval to wait between fetch requests, in milliseconds
* **`startNap`** (Number[]): An array of four numbers, representing the time to begin "napping" ([h, m, s, ms])
* **`endNap`** (Number[]): An array of four numbers, representing the time to stop "napping" and resume fetch requests ([h, m, s, ms])

Because free hosting providers usually limit your [free server time](https://render.com/docs/free), you may want to use the `startNap` and `endNap` parameters to let your server sleep during times that it is unlikely to be used. The start and end times are entered as arrays in the format: [hours, minutes, seconds, milliseconds], and are in Coordinated Universal Time (UTC).


---
## Methods

Upon invoking the default export from **woke-dyno** with your chosen options, you will be returned an object with two methods:

* **`start()`**: Starts **woke-dyno**, using the configured options
* **`stop()`**: Clears the current timer, stopping **woke-dyno**

---
## Credits

**woke-dyno** was made by [Dennis Hodges](https://github.com/fermentationist), a JavaScript developer.

---
## License

#### Copyright © 2019 Dennis Hodges


__The MIT License__

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
