# woke-dyno

**woke-dyno** is a tiny utility to prevent your Heroku dyno (server) from sleeping when not in use. 

Apps hosted on a free Heroku dyno, will ["sleep"](https://devcenter.heroku.com/articles/free-dyno-hours) if they do not receive any web traffic for thirty minutes. When a user loads a sleeping Heroku app, it may take an uncomfortably long time (up to ten seconds!) for the dyno to spin up and serve the page. This is long enough for many users to assume the site is broken and move on. 

**woke-dyno** will perform a simple HTTP request to whatever url you provide, at regular intervals. If you use the url of your free dyno, that single GET request will be sufficient to prevent it from going dormant, so that visitors will not be made to endure unreasonably long loading times.

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
Import the default export from **woke-dyno** (a function) and invoke it after starting up your server, passing the url of your dyno as an argument. To start **woke-dyno**, call its `.start()` method:

```javascript
/* Example: as used with an Express app */

const express = require("express")
const wakeDyno = require("woke-dyno");

// create an Express app
const app = express();

// start the server, then call wokeDyno(url).start()
app.listen(PORT, () => {
    wakeDyno(DYNO_URL).start(); // DYNO_URL should be the url of your Heroku app
});

```
---
##Options

By default, **woke-dyno** will make its HTTP request once every 25 minutes, with no naptime.  By passing an options object, instead of a string, you can change the default settings:

```javascript
/* Example: with custom options */

app.listen(PORT, () => {
    wakeDyno({
        url: DYNO_URL,  // url string
        interval: 60000, // interval in milliseconds (1 minute in this example)
        startNap: [5, 0, 0, 0], // the time to start nap in UTC, as [h, m, s, ms] (05:00 UTC in this example)
        endNap: [9, 59, 59, 999] // time to wake up again, in UTC (09:59:59.999 in this example)
    }).start(); 
});
```
Because Heroku limits your [free dyno hours](https://devcenter.heroku.com/articles/free-dyno-hours), you may want to use the `startNap` and `endNap` parameters to let your dyno sleep during times that it is unlikely to be used. The start and end times are entered as arrays in the format: [hours, minutes, seconds, milliseconds], and are in Coordinated Universal Time (UTC).

---
## Credits

**woke-dyno** was made by [Dennis Hodges](https://github.com/fermentationist), a Javascript developer.

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
