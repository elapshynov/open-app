## OPEN APP [![open-app](https://img.shields.io/npm/v/open-app.svg)](https://npmjs.org/open-app)

> open app in webpage at mobile device

### Installation

```bash
$ npm install open-app
```
or

```html
<script src="//cdn.jsdelivr.net/gh/elapshynov/open-app@master/dist/index.js" ></script>
```

### Example

```js
var openApp = configureOpenApp({
  package: 'com.sankuai.movie',
  scheme : 'meituanmovie://www.meituan.com/movie?id=78535&nm=功夫熊猫3'
});

openApp(); // open app based on device
```

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### MIT

This work is licensed under the [MIT license](./LICENSE).

---
