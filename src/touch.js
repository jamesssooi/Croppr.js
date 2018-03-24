/**
 * Croppr Touch
 * Enables support for touch devices by translating touch events to
 * mouse events.
 */

/**
 * Binds an element's touch events to be simulated as mouse events.
 * @param {Element} element
 */
export default function enableTouch(element) {
  element.addEventListener('touchstart', simulateMouseEvent);
  element.addEventListener('touchend', simulateMouseEvent);
  element.addEventListener('touchmove', simulateMouseEvent);
}

/**
 * Translates a touch event to a mouse event.
 * @param {Event} e
 */
function simulateMouseEvent(e) {
  e.preventDefault();
  const touch = e.changedTouches[0];
  const eventMap = {
    'touchstart': 'mousedown',
    'touchmove': 'mousemove',
    'touchend': 'mouseup'
  }

  touch.target.dispatchEvent(new MouseEvent(eventMap[e.type], {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: touch.clientX,
    clientY: touch.clientY,
    screenX: touch.screenX,
    screenY: touch.screenY,
  }));
}