/**
 * Croppr.js
 * https://github.com/jamesssooi/Croppr.js
 * 
 * A JavaScript image cropper that's lightweight, awesome, and has
 * zero dependencies.
 * 
 * (C) 2017 James Ooi. Released under the MIT License.
 */

import Handle from './handle.js';
import Box from './box.js';

/**
 * Define a list of handles to create.
 * 
 * @property {Array} position - The x and y ratio position of the handle within
 *      the crop region. Accepts a value between 0 to 1 in the order of [X, Y].
 * @property {Array} constraints - Define the side of the crop region that is to
 *      be affected by this handle. Accepts a value of 0 or 1 in the order of
 *      [TOP, RIGHT, BOTTOM, LEFT].
 * @property {String} cursor - The CSS cursor of this handle.
 */
const HANDLES = [
    { position: [0.0, 0.0], constraints: [1, 0, 0, 1], cursor: 'nw-resize' },
    { position: [0.5, 0.0], constraints: [1, 0, 0, 0], cursor: 'n-resize'  },
    { position: [1.0, 0.0], constraints: [1, 1, 0, 0], cursor: 'ne-resize' },
    { position: [1.0, 0.5], constraints: [0, 1, 0, 0], cursor: 'e-resize'  },
    { position: [1.0, 1.0], constraints: [0, 1, 1, 0], cursor: 'se-resize' },
    { position: [0.5, 1.0], constraints: [0, 0, 1, 0], cursor: 's-resize'  },
    { position: [0.0, 1.0], constraints: [0, 0, 1, 1], cursor: 'sw-resize' },
    { position: [0.0, 0.5], constraints: [0, 0, 0, 1], cursor: 'w-resize'  }
]


export default class Croppr {
    constructor(element, options) {
        let self = this;

        // Get options
        self.options = self.parseOptions(options || {});

        // Get target img element
        if (!element.nodeName) {
            element = document.querySelector(element);
            if (element == null) { throw 'Unable to find element.'}
        }

        // Wait until image is loaded before proceeding
        if (element.width === 0 || element.height === 0) {
            element.onload = activate.bind(self);
        } else {
            activate();
        }

        function activate() {
            // Create the DOM elements
            self.createDOM(element);
            
            // Convert % values to px;
            self.options.convertToPixels(this.cropperEl);

            // Listen for events from childrens
            this.attachHandlerEvents(this.eventBus);
            this.attachRegionEvents(this.eventBus);

            // Bootstrap this cropper instance
            self.box = self.createInitialBox();
            self.redraw(self.box);
        }
    }
    
    /**
     * Gets the value of the crop region.
     */
    getValue(mode = null) {
        if (mode === null) { mode = this.options.returnMode; }
        if (mode == 'real') {
            const actualWidth = this.imageEl.naturalWidth;
            const actualHeight = this.imageEl.naturalHeight;
            const factorX = actualWidth / this.imageEl.offsetWidth;
            const factorY = actualHeight / this.imageEl.offsetHeight;
            return {
                x: Math.round(this.box.x1 * factorX),
                y: Math.round(this.box.y1 * factorY),
                width: Math.round(this.box.width() * factorX),
                height: Math.round(this.box.height() * factorY)
            }
        } else if (mode == 'ratio') {
            const elementWidth = this.imageEl.offsetWidth;
            const elementHeight = this.imageEl.offsetHeight;
            return {
                x: round(this.box.x1/elementWidth, 3),
                y: round(this.box.y1/elementHeight, 3),
                width: round(this.box.width()/elementWidth, 3),
                height: round(this.box.height()/elementHeight, 3)
            }
        } else if (mode == 'raw') {
            return {
                x: Math.round(this.box.x1),
                y: Math.round(this.box.y1),
                width: Math.round(this.box.width()),
                height: Math.round(this.box.height())
            }
        }
    }

    /**
     * Parse user options and set default values.
     */
    parseOptions(opts) {
        const defaults = {
            aspectRatio: null,
            maxSize: {width: null, height: null},
            minSize: {width: null, height: null},
            startSize: {width: 100, height: 100, unit: '%'},
            returnMode: 'real',
            onUpdate: () => {},
        }

        // Parse aspect ratio
        let aspectRatio = null;
        if (opts.aspectRatio !== undefined) {
            if (typeof(opts.aspectRatio) === 'number') {
                aspectRatio = opts.aspectRatio
            } else if (opts.aspectRatio instanceof Array) {
                aspectRatio = opts.aspectRatio[1] / opts.aspectRatio[0];
            }
        }

        // Parse max width/height
        let maxSize = null;
        if (opts.maxSize !== undefined && opts.maxSize !== null) {
            maxSize = {
                width: opts.maxSize[0] || null,
                height: opts.maxSize[1] || null,
                unit: opts.maxSize[3] || 'px'
            }
        }

        // Parse min width/height
        let minSize = null;
        if (opts.minSize !== undefined && opts.minSize !== null) {
            minSize = {
                width: opts.minSize[0] || null,
                height: opts.minSize[1] || null,
                unit: opts.minSize[3] || 'px'
            }
        }

        // Parse start size
        let startSize = null;
        if (opts.startSize !== undefined && opts.startSize !== null) {
            startSize = {
                width: opts.startSize[0] || null,
                height: opts.startSize[1] || null,
                unit: opts.startSize[3] || '%'
            }
        }

        // Parse onUpdate callback
        let onUpdate = null;
        if (typeof(opts.onUpdate) === 'function') {
            onUpdate = opts.onUpdate;
        }

        // Parse returnMode value
        let returnMode = null;
        if (opts.returnMode !== undefined) {
            const s = opts.returnMode.toLowerCase();
            if (['real', 'ratio', 'raw'].indexOf(s) === -1) {
                throw "Invalid return mode.";
            }
            returnMode = s;
        }

        // Create function to convert % values to pixels
        const convertToPixels = function(container) {
            const width = container.offsetWidth;
            const height = container.offsetHeight;

            // Convert sizes
            const sizeKeys = ['maxSize', 'minSize', 'startSize'];
            for (let i = 0; i < sizeKeys.length; i++) {
                const key = sizeKeys[i];
                if (this[key] !== null) {
                    if (this[key].unit == '%') {
                        if (this[key].width !== null) {
                            this[key].width = (this[key].width/100) * width;
                        }
                        if (this[key].height !== null) {
                            this[key].height = (this[key].height/100) * height;
                        }
                    }
                    delete this[key].unit;
                }
            }
        }

        const defaultValue = (v, d) => (v !== null ? v : d);
        return {
            aspectRatio: defaultValue(aspectRatio, defaults.aspectRatio),
            maxSize: defaultValue(maxSize, defaults.maxSize),
            minSize: defaultValue(minSize, defaults.minSize),
            startSize: defaultValue(startSize, defaults.startSize),
            returnMode: defaultValue(returnMode, defaults.returnMode),
            onUpdate: defaultValue(onUpdate, defaults.onUpdate),
            convertToPixels: convertToPixels
        }
    }

    /**
     * Creates all the required DOM elements.
     * @param {Element|String} targetEl An element or element query string.
     */
    createDOM(targetEl) {
        // Create main container and use it as the main event listeners
        this.containerEl = document.createElement('div');
        this.containerEl.className = 'croppr-container';
        this.eventBus = this.containerEl;

        // Create cropper element
        this.cropperEl = document.createElement('div');
        this.cropperEl.className = 'croppr';

        // Create image element
        if (!targetEl.getAttribute('src')) {
            throw 'Image src not provided.'
        }
        this.imageEl = document.createElement('img');
        this.imageEl.setAttribute('src', targetEl.getAttribute('src'));
        this.imageEl.setAttribute('alt', targetEl.getAttribute('alt'));
        this.imageEl.className = 'croppr-image';

        // Create clipped image element
        this.imageClippedEl = this.imageEl.cloneNode();
        this.imageClippedEl.className = 'croppr-imageClipped';

        // Create region box element
        this.regionEl = document.createElement('div');
        this.regionEl.className = 'croppr-region';

        // Create overlay element
        this.overlayEl = document.createElement('div');
        this.overlayEl.className = 'croppr-overlay';

        // Create handles element
        let handleContainerEl = document.createElement('div');
        handleContainerEl.className = 'croppr-handleContainer';
        this.handles = [];
        for (let i = 0; i < HANDLES.length; i++) {
            const handle = new Handle(HANDLES[i].position,
                                      HANDLES[i].constraints,
                                      HANDLES[i].cursor,
                                      this.eventBus);
            this.handles.push(handle);
            handleContainerEl.appendChild(handle.el);
        }

        // And then we piece it all together!
        this.cropperEl.appendChild(this.imageEl);
        this.cropperEl.appendChild(this.imageClippedEl);
        this.cropperEl.appendChild(this.regionEl);
        this.cropperEl.appendChild(this.overlayEl);
        this.cropperEl.appendChild(handleContainerEl);
        this.containerEl.appendChild(this.cropperEl);

        // And then finally insert it into the document
        targetEl.parentElement.replaceChild(this.containerEl, targetEl);
    }

    /**
     * Creates the starting crop region.
     */
    createInitialBox() {
        // Get options
        const opts = this.options;

        // Create initial box
        const width = opts.startSize.width;
        const height = opts.startSize.height;
        let box = new Box(0, 0, width, height)

        // Maintain ratio
        box.constrainToRatio(opts.aspectRatio, [0.5, 0.5]);

        // Maintain minimum/maximum size
        const min = opts.minSize;
        const max = opts.maxSize;
        box.constrainToSize(max.width, max.height, min.width,
                            min.height, [0.5, 0.5]);

        // Constrain to boundary
        const parentWidth = this.cropperEl.offsetWidth;
        const parentHeight = this.cropperEl.offsetHeight;
        box.constrainToBoundary(parentWidth, parentHeight, [0.5, 0.5]);

        // Move to center
        const x = (this.cropperEl.offsetWidth / 2) - (box.width() / 2);
        const y = (this.cropperEl.offsetHeight / 2) - (box.height() / 2);
        box.move(x, y);

        return box;
    }

    /**
     * Redraw visuals (border, handles, etc).
     * @param {Box} box A box object describing the cropped region.
     */
    redraw(box) {

        const x1 = box.x1
        const x2 = box.x2
        const y1 = box.y1
        const y2 = box.y2
        const width = box.width();
        const height = box.height();

        // Update region element
        this.regionEl.style.left = x1 + 'px';
        this.regionEl.style.top = y1 + 'px';
        this.regionEl.style.width = width + 'px';
        this.regionEl.style.height = height + 'px';

        // Update clipped image element
        this.imageClippedEl.style.clip = `rect(${y1}px,
                                               ${x2}px,
                                               ${y2}px,
                                               ${x1}px)`;

        // Update handle positions
        for (let i = 0; i < this.handles.length; i++) {
            let handle = this.handles[i];

            // Calculate handle position
            const left = x1 + (width * handle.position[0]);
            const top = y1 + (height * handle.position[1]);

            // Apply new position
            handle.el.style.left = left + 'px';
            handle.el.style.top = top + 'px';
        }
    }

    /**
     * Attach listeners for events emitted by the handles.
     * Enables resizing of the region element.
     */
    attachHandlerEvents(eventBus) {
        eventBus.addEventListener('handlemove', handleMove.bind(this));
        eventBus.addEventListener('handlestart', handleStart.bind(this));
    }

    /**
     * Attach event listeners for the crop region element.
     * Enables dragging/moving of the region element.
     */
    attachRegionEvents(eventBus) {
        this.regionEl.addEventListener('mousedown', onMouseDown);
        eventBus.addEventListener('regionstart', regionStart.bind(this));
        eventBus.addEventListener('regionmove', regionMove.bind(this));

        function onMouseDown(e) {
            e.stopPropagation();
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('mousemove', onMouseMove);
            // Notify parent
            const event = new CustomEvent('regionstart', {
                detail: {mouseX: e.clientX, mouseY: e.clientY}
            });
            eventBus.dispatchEvent(event);
        }

        function onMouseUp(e) {
            e.stopPropagation();
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
        }

        function onMouseMove(e) {
            e.stopPropagation();
            // Notify parent
            const event = new CustomEvent('regionmove', {
                detail: {mouseX: e.clientX, mouseY: e.clientY}
            });
            eventBus.dispatchEvent(event);
        }
    }
}


// EVENT HANDLERS

/**
 * Executes when user begins dragging a handle.
 */
function handleStart(e) {
    let handle = e.detail.handle;

    // The origin point is the point where the box is scaled from.
    // This is usually the opposite side/corner of the active handle.
    const originPoint = [1 - handle.position[0], 1 - handle.position[1]];
    let [originX, originY] = this.box.getAbsolutePoint(originPoint);
    
    this.activeHandle = {
        handle: handle,
        originPoint: originPoint,
        originX: originX,
        originY: originY,
    }
}

/**
 * Main logic to manage the movement of handles.
 * @param {CustomEvent} e Custom event containing the x and y position of
 *      the mouse.
 */
function handleMove(e) {
    let {mouseX, mouseY} = e.detail;

    // Calculate mouse's position in relative to the container
    let container = this.cropperEl.getBoundingClientRect();
    mouseX = mouseX - container.left;
    mouseY = mouseY - container.top;

    // Ensure mouse is within the boundaries
    if (mouseX < 0) { mouseX = 0; }
    else if (mouseX > container.width) { mouseX = container.width; }
    
    if (mouseY < 0) { mouseY = 0; }
    else if (mouseY > container.height) { mouseY = container.height; }
    
    // Bootstrap helper variables
    let origin = this.activeHandle.originPoint.slice();
    const originX = this.activeHandle.originX;
    const originY = this.activeHandle.originY;
    const handle = this.activeHandle.handle;
    const TOP_MOVABLE = handle.constraints[0] === 1;
    const RIGHT_MOVABLE = handle.constraints[1] === 1;
    const BOTTOM_MOVABLE = handle.constraints[2] === 1;
    const LEFT_MOVABLE = handle.constraints[3] === 1;
    const MULTI_AXIS = (LEFT_MOVABLE || RIGHT_MOVABLE) &&
                       (TOP_MOVABLE || BOTTOM_MOVABLE);

    // Apply movement to respective sides according to the handle's
    // constraint values.
    let x1 = LEFT_MOVABLE || RIGHT_MOVABLE ? originX : this.box.x1;
    let x2 = LEFT_MOVABLE || RIGHT_MOVABLE ? originX : this.box.x2;
    let y1 = TOP_MOVABLE || BOTTOM_MOVABLE ? originY : this.box.y1;
    let y2 = TOP_MOVABLE || BOTTOM_MOVABLE ? originY : this.box.y2;
    x1 = LEFT_MOVABLE ? mouseX : x1;
    x2 = RIGHT_MOVABLE ? mouseX : x2;
    y1 = TOP_MOVABLE ? mouseY: y1;
    y2 = BOTTOM_MOVABLE ? mouseY: y2;

    // Check if the user dragged past the origin point. If it did,
    // we set the flipped flag to true.
    let [isFlippedX, isFlippedY] = [false, false];
    if (LEFT_MOVABLE || RIGHT_MOVABLE) {
        isFlippedX = LEFT_MOVABLE ? mouseX > originX : mouseX < originX;
    }
    if (TOP_MOVABLE || BOTTOM_MOVABLE) {
        isFlippedY = TOP_MOVABLE ? mouseY > originY : mouseY < originY;
    }

    // If it is flipped, we swap the coordinates and flip the origin point.
    if (isFlippedX) {
        const tmp = x1; x1 = x2; x2 = tmp; // Swap x1 and x2
        origin[0] = 1 - origin[0]; // Flip origin x point
    }
    if (isFlippedY) {
        const tmp = y1; y1 = y2; y2 = tmp; // Swap y1 and y2
        origin[1] = 1 - origin[1]; // Flip origin y point
    }
    
    // Create new box object
    let box = new Box(x1, y1, x2, y2);

    // Maintain aspect ratio
    if (this.options.aspectRatio) {
        const ratio = this.options.aspectRatio;
        let isVerticalMovement = false;
        if (MULTI_AXIS) {
            isVerticalMovement = (mouseY > box.y1 + ratio * box.width()) ||
                                 (mouseY < box.y2 - ratio * box.width());
        } else if (TOP_MOVABLE || BOTTOM_MOVABLE) {
            isVerticalMovement = true;
        }
        const ratioMode = isVerticalMovement ? 'width' : 'height';
        box.constrainToRatio(ratio, origin, ratioMode);
    }

    // Maintain minimum/maximum size
    const min = this.options.minSize;
    const max = this.options.maxSize;
    box.constrainToSize(max.width, max.height, min.width, min.height, origin);

    // Constrain to boundary
    const parentWidth = this.cropperEl.offsetWidth;
    const parentHeight = this.cropperEl.offsetHeight;
    box.constrainToBoundary(parentWidth, parentHeight, origin);

    // Finally, update the visuals (border, handles, clipped image, etc)
    this.box = box;
    this.redraw(this.box);

    // Call the callback
    this.options.onUpdate(this.getValue());
}

/**
 * Executes when user starts moving the crop region.
 */
function regionStart(e) {
    let {mouseX, mouseY} = e.detail;

    // Calculate mouse's position in relative to the container
    let container = this.cropperEl.getBoundingClientRect();
    mouseX = mouseX - container.left;
    mouseY = mouseY - container.top;

    this.currentMove = {
        offsetX: mouseX - this.box.x1,
        offsetY: mouseY - this.box.y1
    }
}

/**
 * Main logic to handle the movement of the crop region.
 */
function regionMove(e) {
    let {mouseX, mouseY} = e.detail;
    let {offsetX, offsetY} = this.currentMove;

    // Calculate mouse's position in relative to the container
    let container = this.cropperEl.getBoundingClientRect();
    mouseX = mouseX - container.left;
    mouseY = mouseY - container.top;

    this.box.move(mouseX - offsetX, mouseY - offsetY);

    // Ensure box is within the boundaries
    if (this.box.x1 < 0) {
        this.box.move(0, null);
    }
    if (this.box.x2 > container.width) {
        this.box.move(container.width - this.box.width(), null);
    }
    if (this.box.y1 < 0) {
        this.box.move(null, 0);
    }
    if (this.box.y2 > container.height) {
        this.box.move(null, container.height - this.box.height());
    }

    this.redraw(this.box);

    // Call the callback
    this.options.onUpdate(this.getValue());
}


/**
 * HELPER FUNCTIONS
 */

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}


/**
 * POLYFILLS
 */
(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();