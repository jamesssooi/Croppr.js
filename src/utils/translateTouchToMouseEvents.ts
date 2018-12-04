/**
 * Binds an element's touch events to be simulated as mouse events.
 */
export default function translateTouchToMouseEvents(element: Element) {
  element.addEventListener('touchstart', simulateMouseEvent);
  element.addEventListener('touchend', simulateMouseEvent);
  element.addEventListener('touchmove', simulateMouseEvent);
}


const _eventMapping = {
  touchstart: 'mousedown',
  touchmove: 'mousemove',
  touchend: 'mouseup',
}


/**
 * Translates a touch event to a mouse event.
 */
function simulateMouseEvent(e) {
  e.preventDefault();
  const touch = e.changedTouches[0];
  touch.target.dispatchEvent(new MouseEvent(_eventMapping[e.type], {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: touch.clientX,
    clientY: touch.clientY,
    screenX: touch.screenX,
    screenY: touch.screenY,
  }));
}
