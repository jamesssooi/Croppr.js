import { Point, HandleConstraints } from '../types';

class Handle {

  /** The normalized x and y coordinates of the handle within the crop region. */
  public position: Point;

  /** The handle DOM element. */
  public element: HTMLElement;

  /** The sides of the crop region that this handle will affect. */
  public constraints: HandleConstraints;

  /** The element to dispatch events to. */
  private eventBus: Element;

  /**
   * @constructor
   */
  constructor(position: Point, constraints: HandleConstraints, cursor: string, eventBus: Element) {
    this.position = position;
    this.constraints = constraints;
    this.eventBus = eventBus;
    this.element = this.createHandleElement(cursor);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    this.element.addEventListener('mousedown', this.onMouseDown);
  }

  /**
   * Creates the handle's DOM elements.
   */
  private createHandleElement(cursor: string) {
    const element = document.createElement('div');
    element.className = 'croppr-handle';
    element.style.cursor = cursor;
    return element;
  }

  /**
   * Handles mouse down events.
   */
  private onMouseDown(e: MouseEvent) {
    e.stopPropagation();
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
    this.eventBus.dispatchEvent(new CustomEvent('handlestart', {
      detail: { handle: this }
    }));
  }

  /**
   * Handles mouse up events.
   */
  private onMouseUp(e: MouseEvent) {
    e.stopPropagation();
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    this.eventBus.dispatchEvent(new CustomEvent('handleend', {
      detail: { handle: this }
    }));
  }

  /**
   * Handles mouse move events.
   */
  private onMouseMove(e: MouseEvent) {
    e.stopPropagation();
    this.eventBus.dispatchEvent(new CustomEvent('handlemove', {
      detail: { mouseX: e.clientX, mouseY: e.clientY }
    }));
  }

}

export default Handle;
