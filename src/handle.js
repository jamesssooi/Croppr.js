/**
 * Handle component
 */
export default class Handle {

  /**
   * Creates a new Handle instance.
   * @constructor
   * @param {Array} position The x and y ratio position of the handle
   *      within the crop region. Accepts a value between 0 to 1 in the order
   *      of [X, Y].
   * @param {Array} constraints Define the side of the crop region that
   *      is to be affected by this handle. Accepts a value of 0 or 1 in the
   *      order of [TOP, RIGHT, BOTTOM, LEFT].
   * @param {String} cursor The CSS cursor of this handle.
   * @param {Element} eventBus The element to dispatch events to.
   */
  constructor(position, constraints, cursor, eventBus) {

    var self = this;
    this.position = position;
    this.constraints = constraints;
    this.cursor = cursor;
    this.eventBus = eventBus;

    // Create DOM element
    this.el = document.createElement('div');
    this.el.className = 'croppr-handle';
    this.el.style.cursor = cursor;

    // Attach initial listener
    this.el.addEventListener('mousedown', onMouseDown);

    function onMouseDown(e) {
      e.stopPropagation();
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);

      // Notify parent
      self.eventBus.dispatchEvent(new CustomEvent('handlestart', {
        detail: { handle: self }
      }));
    }

    function onMouseUp(e) {
      e.stopPropagation();
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);

      // Notify parent
      self.eventBus.dispatchEvent(new CustomEvent('handleend', {
        detail: { handle: self }
      }));
    }

    function onMouseMove(e) {
      e.stopPropagation();

      // Notify parent
      self.eventBus.dispatchEvent(new CustomEvent('handlemove', {
        detail: { mouseX: e.clientX, mouseY: e.clientY }
      }));
    }
  }
}