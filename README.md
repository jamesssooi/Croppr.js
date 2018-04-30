![Croppr.js](https://raw.githubusercontent.com/jamesssooi/Croppr.js/master/assets/logo.png)

### A vanilla JavaScript image cropper that's lightweight, awesome, and has absolutely zero dependencies.

* Lightweight (<6kb minified and gzipped)
* Made only with native, delicious vanilla JS
* Zero dependencies
* Supports touch devices!
* Includes TypeScript typings!

**[Try it out in the demo →](https://jamesssooi.github.io/Croppr.js)**

## Installation

**Via NPM:**

```bash
npm install croppr -—save
```

```javascript
// CommonJS
var Croppr = require('croppr');

// ES6 import
import Croppr from 'croppr';
```
_Note: Don't forget to bundle or include croppr.css!_

**Via Bower:**
```bash
bower install croppr
```
Then include via script tag below.

**Via script tag:**

```html
<link href="path/to/croppr.css" rel="stylesheet"/>
<script src="path/to/croppr.js"></script>
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

#### **aspectRatio**

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



#### **onCropStart**

A callback function that is called when the user starts modifying the crop region.

* Type: `Function`
* Arguments: `data = {x, y, width, height}`
* Example:
```javascript
onCropStart: function(data) {
  console.log(data.x, data.y, data.width, data.height);
}
```

#### **onCropMove**

A callback function that is called when the crop region changes.

* Type: `Function`
* Arguments: `data = {x, y, width, height}`
* Example:
```javascript
onCropMove: function(data) {
  console.log(data.x, data.y, data.width, data.height);
}
```

#### **onCropEnd**

A callback function that is called when the user stops modifying the crop region.

* Type: `Function`
* Arguments: `data = {x, y, width, height}`
* Example:
```javascript
onCropEnd: function(data) {
  console.log(data.x, data.y, data.width, data.height);
}
```

#### onInitialize

A callback function that is called when the Croppr instance is fully initialized.

* Type: `Function`
* Arguments: The Croppr instance
* Example:
```javascript
onInitialize: function(instance) {
  // do things here
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

#### getValue(_returnMode?: string_)

Returns the value of the crop region. `returnMode` inherits from options by default. Refer to [returnMode](#returnmode) for possible values.

```javascript
var value = cropInstance.getValue();
// value = {x: 21, y: 63: width: 120, height: 120}

var ratio = cropInstance.getValue('ratio');
// value = {x: 0.1, y: 0.3: width: 0.57, height: 0.57}
```

#### destroy()

Destroys the Croppr instance and restores the original `img` element.

#### setImage(src: string)

Changes the image src. Returns the Croppr instance.

#### moveTo(x: number, y: number)

Moves the crop region to the specified coordinates. Returns the Croppr instance.

#### resizeTo(width: number, height: number, _origin?: Array_)

Resizes the crop region to the specified size. `origin` is an optional argument that specifies the origin point (in ratio) to resize from in the format of `[x, y]`. Defaults to `[0.5, 0.5]` (center). Returns the Croppr instance.

#### scaleBy(factor: number, _origin?: Array_)

Scales the crop region by a factor. `origin` is an optional argument that specifies the origin point (in ratio) to resize from in the format of `[x, y]`. Defaults to `[0.5, 0.5]` (center). Returns the Croppr instance.

#### reset()

Resets the crop region to its original position and size. Returns the Croppr instance.

- - -

[![Build Status](https://travis-ci.org/jamesssooi/Croppr.js.svg?branch=master)](https://travis-ci.org/jamesssooi/Croppr.js)

Copyright © 2018 James Ooi.
Released under the MIT License.
