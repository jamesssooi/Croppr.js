# Croppr.js [![Build Status](https://travis-ci.org/jamesssooi/Croppr.js.svg?branch=master)](https://travis-ci.org/jamesssooi/Croppr.js)

### A JavaScript image cropper that's lightweight, awesome, and has absolutely zero dependencies.

* Simple
* Lightweight (4kb minified and gzipped)
* Zero dependencies

Try it out in the demo →
_Demo in progress_

## Installation

**Via NPM:**

```
npm install croppr -—save
```

```javascript
// CommonJS
var Croppr = require('croppr');

// ES6 import
import Croppr from 'croppr';
```
_Note: Don't forget to bundle or include croppr.css!_

**Via script tag:**

```html
<script src="path/to/croppr.js"></script>
<link src="path/to/croppr.css" rel="stylesheet"/>
```


## Basic Usage

**In your HTML document:**

```html
<img src="path/to/image.jpg" id="croppr"/>
```

**In your JavaScript file:**

```javascript
var cropInstance = new Croppr('#croppr', {
  // ...options
});
```

_Protip: You can also pass an `Element` object directly instead of a selector._

**To retrieve crop region:**

```javascript
var data = cropInstance.getValue();
// data = {x: 20, y: 20: width: 120, height: 120}
```



## Options

####**aspectRatio**

Constrain the crop region to an aspect ratio.

* Type: `Number`
* Default: `null`
* Example: `aspectRatio: 1` (Square)



#### **maxSize**

Constrain the crop region to a maximum size.

* Type: `[width, height, unit?]`
* Default: `null`
* Example: `maxSize: [50, 50, '%']` (A maximum size of 50% of the image size)

_Note: `unit` accepts a value of **'px'** or **'%'**. Defaults to **'px'**._



#### **minSize**

Constrain the crop region to a minimum size.

- Type: `[width, height, unit?]`
- Default: `null`
- Example: `minSize: [20, 20, 'px']` (A minimum width and height of 20px)

_Note: `unit` accepts a value of **'px'** or **'%'**. Defaults to **'px'**._



#### **startSize**

The starting size of the crop region when it is initialized.

- Type: `[width, height, unit?]`
- Default: `[100, 100, '%']` (A starting crop region as large as possible)
- Example: `startSize: [50, 50]` (A starting crop region of 50% of the image size)

_Note: `unit` accepts a value of **'px'** or **'%'**. Defaults to **'%'**._



#### **onUpdate**

A callback function that is called when the crop region is updated.

* Type: `Function`
* Arguments: `data = {x, y, width, height}`
* Example:
```javascript
onUpdate: function(data) {
  console.log(data.x, data.y, data.width, data.height);
}
```



#### **returnMode**

Define how the crop region should be calculated.

* Type: `String`
* Default: `"real"`
* Possible values: `"real"`, `"ratio"` or `"raw"`
  * `real` returns the crop region values based on the size of the image's actual sizes. This ensures that the crop region values are the same regardless if the Croppr element is scaled or not.
  * `ratio` returns the crop region values as a ratio between 0 to 1. e.g. For example, an `x, y` position at the center will be `{x: 0.5, y: 0.5}`.
  * `raw` returns the crop region values as is based on the size of the Croppr element.



## Methods

#### **getValue(_returnMode?: string_)**

Returns the value of the crop region. `returnMode` inherits from options by default. Refer to [returnMode](#returnmode) for possible values.

```javascript
var value = cropInstance.getValue();
// value = {x: 21, y: 63: width: 120, height: 120}

var ratio = cropInstance.getValue('ratio');
// value = {x: 0.1, y: 0.3: width: 0.57, height: 0.57}
```

Copyright © 2017 James Ooi.
Released under the MIT License.