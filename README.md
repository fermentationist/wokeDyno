# woke-dyno

**woke-dyno** is a tiny utility to prevent your Heroku dyno (server) from sleeping when not in use. 

According to [**herokuapp.com**, `If an app has a free web dyno, and that dyno receives no web traffic in a 30-minute period, it will sleep.`](https://devcenter.heroku.com/articles/free-dyno-hours) When a user loads a sleeping heroku app, it may take an uncomfortably long time (up to ten seconds!) for the dyno to spin up and serve the page. This is long enough for many users to assume the site is broken and move on. 

**woke-dyno** will perform a simple HTTP request to whatever url you provide, at regular intervals. If you use the url of your free dyno, that single GET request will be sufficient to prevent it from going dormant, so that visitors will not be made to endure unreasonably long loading times.

---
## Installation
To install with **npm**:
```bash
npm install --save "woke-dyno"
```
To install with **Yarn**:
```bash
yarn add "woke-dyno"
```
---
## Use
Import the default export from **woke-dyno** (a function) and invoke it after starting up your server. Pass in the url of your dyno as an argument:

```node
/* Example: as used with an Express app */

const express = require("express")
const wakeDyno = require("woke-dyno");

// create an Express app
const app = express();

// start the server, then run wokeDyno
app.listen(PORT, () => {
    wakeDyno(DYNO_URL); // DYNO_URL should be the url of your Heroku app
});

```

The function will return a `Promise`, so you can use `then` to chain additional functions, if you wish.

```node
app.listen(PORT, () => {
    wakeDyno(DYNO_URL).then(() => console.log("This happens next."));
});

```

---
## Options
A list of the icon names accepted by the component can be found in the [Devicons cheatsheet](http://vorillaz.github.io/devicons/#/cheat), or can be returned as an array by using the package's `iconList` export. **woke-dyno** also exports the `RandomIcon` component to display a randomly chosen icon.

```js
import DevIcon, {iconList, RandomIcon} from "woke-dyno";

console.log(`Here is a list of icon names used by this component: ${iconList}`);

const Demo = props => {
    return (<RandomIcon />);
}
```

---
## Credits

**woke-dyno** was made by Dennis Hodges, a Javascript developer.

Thank you to [Theodore Vorillas](https://www.vorillaz.com/), who created the font and icon collection that this component is based on, and which is the source of all of the svg path data used in this package.

You can find his original icon repository here: [Devicons](https://github.com/vorillaz/devicons).

---
## License

#### Copyright © 2019 [Dennis Hodges](https://github.com/fermentationist) 


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