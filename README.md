# Croppr.js

A JavaScript image cropper that's lightweight, awesome, and has absolutely zero dependencies.

* Simple
* Lightweight (4kb minified and gzipped)
* Zero dependencies

[Try it out in the demo →](https://google.com)



## Installation

Via NPM:

```
npm install croppr-js —save
```

```javascript
// CommonJS
var Croppr = require('cropper-js');

// ES6 import
import Croppr from 'cropper-js';
```

Via `<script>` tag:

```
<script src="path/to/croppr.js"></script>
```

The `Croppr` constructor will be available globally.



## Basic Usage

In your HTML document:

```html
<img src="path/to/image.jpg" id="croppr"/>
```

In your JavaScript document:

```javascript
var cropInstance = new Croppr('#croppr', {
  // ...options
});
```

_Protip: You can also pass an `Element` object directly instead of a selector._

To retrieve crop region:

```javascript
var data = cropInstance.getValue();
// data = {x: 20, y: 20: width: 120, height: 120}
```



## Options

**aspectRatio**

Constrain the crop region to an aspect ratio.

* Type: `Number`
* Default: `null`
* Example: `aspectRatio: 1` (Square)





**maxSize**

Constrain the crop region to a maximum size.

* Type: `[width, height, unit?]`


* Default: `null`


* Example: `[50, 50, '%']` (A maximum size of 50% of the image size)

_Note: `unit` accepts a value of **'px'** or **'%'**. It is optional and defaults to **'px'**._



**minSize**

Constrain the crop region to a minimum size.

- Type: `[width, height, unit?]`


- Default: `null`


- Example: `[20, 20, 'px']` (A minimum size of 50% of the image size)

_Note: `unit` accepts a value of **'px'** or **'%'**. It is optional and defaults to **'px'**._



**startSize**

The starting size of the crop region when it is initialized.

- Type: `[width, height, unit?]`


- Default: `[100, 100, '%']` (A starting crop region as large as possible)


- Example: `[50, 50]` (A starting crop region of 50% of the image size)

_Note: `unit` accepts a value of **'px'** or **'%'**. It is optional and defaults to **'%'**._



**onUpdate**

A callback function that is called when the crop region is updated.

* Type: `Function`
* Arguments: `data = {x, y, width, height}`


* Example:

```javascript
  function(data) {
    console.log(data.x, data.y, data.width, data.height);
  }
```



**returnMode**

Define how the crop region should be calculated.

* Type: `String`
* Default: `"real"`
* Possible values: `"real"`, `"ratio"` or `"raw"`
  * `real` returns the crop region values based on the size of the image's actual sizes. This ensures that the crop region values are the same regardless if the Croppr element is scaled or not.
  * `ratio` returns the crop region values as a ratio between 0 to 1. e.g. An `x, y` position at the center will be `{x: 0.5,  y: 0.5}`.
  * `raw` returns the crop region values as is based on the size of the Croppr element.



## Methods

**getValue(**_returnMode?: string_**)**

Returns the value of the crop region. Refer to `returnMode` in [Section: Options](#options) for possible values. Inherits from options by default.

```javascript
var value = cropInstance.getValue();
// value = {x: 21, y: 63: width: 120, height: 120}
```



## License

MIT License

Copyright (c) 2017 James Ooi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
