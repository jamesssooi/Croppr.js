'use strict';

/**!
 * Croppr.js Demo Page
 * A vanilla JavaScript image cropper that's lightweight, awesome, and has
 * absolutely zero dependencies.
 *
 * (C) 2017 James Ooi
 */

window.onload = function () {

    // Create Croppr instance
    var croppr = new Croppr('#croppr', {
        startSize: [80, 80, '%'],
        maxSize: [100, 100, 'px'],
        onUpdate: function onUpdate(value) {
            updateValue(value.x, value.y, value.width, value.height);
        }
    });

    // Aspect Ratio
    var ratioCheckbox = document.getElementById('cb-ratio');
    var ratioInput = document.getElementById('input-ratio');
    ratioCheckbox.addEventListener('change', function (event) {
        if (!event.target.checked) {
            croppr.options.aspectRatio = null;
            ratioInput.disabled = true;
            ratioInput.classList.remove('is-danger');
            croppr.reset();
            return;
        }

        ratioInput.disabled = false;
        var value = ratioInput.value;
        if (!isNumber(value)) {
            if (value !== '') {
                ratioInput.classList.add('is-danger');
            }
            return;
        } else {
            ratioInput.classList.remove('is-danger');
        }
        croppr.options.aspectRatio = Number(value);

        croppr.reset();
    });
    ratioInput.addEventListener('input', function (event) {
        if (!ratioCheckbox.checked) {
            return;
        }
        var value = ratioInput.value;
        if (!isNumber(value)) {
            ratioInput.classList.add('is-danger');
            return;
        } else {
            ratioInput.classList.remove('is-danger');
            value = Number(value);
            croppr.options.aspectRatio = value;
            croppr.reset();
        }
    });

    // Maximum size
    var maxCheckbox = document.getElementById('max-checkbox');
    var maxInputWidth = document.getElementById('max-input-width');
    var maxInputHeight = document.getElementById('max-input-height');
    var maxInputUnit = document.getElementById('max-input-unit');
    maxCheckbox.addEventListener('change', function (event) {
        var elements = [maxInputWidth, maxInputHeight, maxInputUnit];

        if (!event.target.checked) {
            croppr.options.maxSize = { width: null, height: null };
            elements.map(function (el) {
                el.disabled = true;
                el.classList.remove('is-danger');
            });
            croppr.reset();
            return;
        }

        elements.map(function (el) {
            el.disabled = false;
        });

        var values = elements.map(parseElementValues);
        croppr.options.maxSize = {
            width: values[0],
            height: values[1],
            unit: values[2]
        };
        croppr.reset();
    });

    console.log(croppr);
};

/** Functions */
function updateValue(x, y, w, h) {
    document.getElementById("valX").innerHTML = '<strong>x</strong>&nbsp;' + x;
    document.getElementById("valY").innerHTML = '<strong>y</strong>&nbsp;' + y;
    document.getElementById("valW").innerHTML = '<strong>width</strong>&nbsp;' + w;
    document.getElementById("valH").innerHTML = '<strong>height</strong>&nbsp;' + h;
}

function isNumber(value) {
    if (isNaN(parseInt(value))) {
        return false;
    }
    if (value === '') {
        return false;
    }
    return true;
}

function parseElementValues(element) {
    var value = element.value;
    if (element.tagName !== 'SELECT') {
        if (!isNumber(value)) {
            if (value !== '') {
                element.classList.add('is-danger');
            }
            return null;
        } else {
            element.classList.remove('is-danger');
            return value;
        }
    } else {
        return value;
    }
}
