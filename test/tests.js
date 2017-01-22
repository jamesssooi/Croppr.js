/**
 * Croppr.js unit tests
 */
"use strict";

var jsdom = require('mocha-jsdom');
var fs = require('fs');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var Croppr = require('../dist/croppr.js');


/**
 * Create the fake html page.
 * Mock image size is 500x500.
 */
jsdom({
    html: fs.readFileSync('test/mock.html', 'utf-8'),
    globalize: true,
    features: {
        FetchExternalResources: ["script", "link", "img"],
        ProcessExternalResources: ["script", "img"]
    }
});

describe('Croppr constructor', function() {
    it('should be a function', function() {
      assert.equal(typeof Croppr, 'function');
    });
});

describe('Croppr', function() {
    beforeEach('setup fake dom', function() {
        document.body.innerHTML = '<img src="mock.jpg" id="croppr" width="500" height="500">'
    });

    describe('Croppr instantiation', function() {
        it('should work by passing a query selector', function() {
            assert.doesNotThrow(function() {
                new Croppr('#croppr', {});
            });
        });

        it('should work by passing an Element object', function() {
            let el = document.getElementById('croppr');
            assert.doesNotThrow(function() {
                new Croppr(el, {});
            });
        });

        it('should throw exception when element is not found', function() {
            assert.throws(function() { new Croppr('#404', {}); });
        });

        it('should throw exception when element is not an img', function() {
            document.body.innerHTML = '<div id="croppr"></div>';
            assert.throws(function() { new Croppr('#croppr'); });
        });

        it('should throw exception when img has no src', function() {
            document.body.innerHTML = '<img id="croppr">';
            assert.throws(function() { new Croppr('#croppr'); });
        });

        it('should work without specifying any options', function() {
            assert.doesNotThrow(function() { new Croppr('#croppr'); });
        });
    });

    describe('Croppr options', function() {
        it('should translate % values to px', function() {
            let instance = new Croppr('#croppr', {
                maxSize: [50, 50, '%']
            }, true);
            instance.cropperEl = {offsetWidth: 500, offsetHeight: 500};
            instance.options.convertToPixels({
                offsetWidth: 500,
                offsetHeight: 500
            });
            const maxSize = instance.options.maxSize;
            assert.deepEqual(maxSize, {width: 250, height: 250});
        });

        it('should have a default full sized crop region', function() {
            let instance = createMockCroppr({});
            assert.deepEqual(instance.box, {x1: 0, y1: 0, x2: 500, y2: 500});
        });

        it('should respect ratio if given', function() {
            const ratio = 1.2;
            let instance = createMockCroppr({aspectRatio: ratio});
            let boxRatio = instance.box.height()/instance.box.width();
            assert.equal(boxRatio.toFixed(2), ratio.toFixed(2));
        });

        it('should respect max size if given', function() {
            let instance = createMockCroppr({maxSize: [50, 50, 'px']});
            assert.equal(instance.box.width(), 50);
            assert.equal(instance.box.height(), 50);
        });
    });
});


describe('Croppr behaviour', function() {
    beforeEach('setup fake dom', function() {
        document.body.innerHTML = '<img src="mock.jpg" id="croppr" width="500" height="500">'
    });

    describe('Respect to constraints', function() {
        var instance = null;
        before('setup instance and simulate movement', function() {
            instance = createMockCroppr({
                aspectRatio: 1.5,
                maxSize: [300, 300, 'px'],
                minSize: [50, 50, 'px'],
            });
        })

        afterEach('reset box', function() {
            instance.reset();
        })

        it('should respect aspect ratio on mouse move', function() {
            // Bottom right handle
            const handle = {constraints: [0, 1, 1, 0], position: [1, 1]}

            // Move up by 50 pixels
            simulateMove(instance, handle, 500, 450);

            // Assert values
            let boxRatio = instance.box.height()/instance.box.width();
            boxRatio = boxRatio.toFixed(2);

            assert.equal(boxRatio, 1.5.toFixed(2));
        });

        it('should respect the maximum size', function() {
            // Bottom right handle
            const handle = {constraints: [0, 1, 1, 0], position: [1, 1]}

            // Drag handle to bottom right
            simulateMove(instance, handle, 500, 500);

            assert.isTrue(instance.box.width() <= 300);
            assert.isTrue(instance.box.height() <= 300);
        });

        it('should respect the minimum size', function() {
            // Bottom right handle
            const handle = {constraints: [0, 1, 1, 0], position: [1, 1]}

            const x1 = instance.box.x1,
                  y1 = instance.box.y1;

            // Drag handle to upper left
            simulateMove(instance, handle, x1 + 10, y1 + 10);

            assert.isTrue(instance.box.width() >= 50);
            assert.isTrue(instance.box.height() >= 50);
        })
    });

    describe('Handle behaviour', function() {
        var instance = null;
        before('setup instance and simulate movement', function() {
            instance = createMockCroppr({});
        });

        afterEach('reset box', function() {
            instance.reset();
        });
    })
});


/**
 * Helper functions
 */
function createMockCroppr(options) {
    let instance = new Croppr('#croppr', options, true);
    sinon.stub(instance, 'createDOM', function() {
        // Mock containerEl & eventBus
        this.containerEl = document.createElement('div');
        this.containerEl['offsetWidth'] = 500;
        this.containerEl['offsetHeight'] = 500;
        this.eventBus = this.containerEl;

        // Mock imageEl
        this.imageEl = {offsetWidth: 500, offsetHeight: 500,
                        naturalWidth: 1000, naturalHeight: 1000};
        
        // Mock cropperEl
        this.cropperEl = {
            offsetWidth: 500,
            offsetHeight: 500,
            getBoundingClientRect: function() {
                return {left: 0, top: 0}
            }
        }

        // Mock clipped image el
        this.imageClippedEl = { style: {clip: null}}

        // Mock regionEl
        this.regionEl = document.createElement('div');

        // Mock handles
        this.handles = [];
    });
    instance.initialize();
    return instance;
}

function simulateMove(instance, handle, mouseX, mouseY) {
    // Set active handle
    const originPoint = [1 - handle.position[0], 1 - handle.position[1]];
    let originX = instance.box.getAbsolutePoint(originPoint)[0];
    let originY = instance.box.getAbsolutePoint(originPoint)[1];
    instance.activeHandle = {handle, originPoint, originX, originY}

    // Simulate movement
    instance.onHandleMoveMoving({
        detail: {mouseX: mouseX, mouseY: mouseY}
    });
}