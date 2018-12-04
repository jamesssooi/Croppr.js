import CropprCore from "../core";
import Handle from '../lib/handle';
import { Engine, Point } from "../types";
import * as Utils from '../utils';
import Box from "../lib/box";

class onHandleMoveEngine implements Engine {

  private croppr: CropprCore;
  private eventBus: HTMLElement;
  private activeHandle: {
    handle: Handle
    origin: Point
    originX: number
    originY: number
  }

  /**
   * @constructor
   */
  constructor(eventBus: HTMLElement, croppr: CropprCore) {
    this.croppr = croppr;
    this.eventBus = eventBus;
  }

  public onStart(e) {
    const handle = e.detail.handle;

    // The origin point is the point where the box will be scaled from. This
    // defaults to the opposite side/corner of the active handle.
    const originPoint = [1 - handle.position[0], 1 - handle.position[1]];
    const absPos = this.croppr.box.getAbsolutePoint(<Point> originPoint);

    // Set active handle
    this.activeHandle = {
      handle: handle,
      origin: <Point> originPoint,
      originX: absPos[0],
      originY: absPos[1],
    };

    this.eventBus.dispatchEvent(new CustomEvent('cropstart'));
    return null;
  }

  public onMove(e) {
    let mouseX = e.detail.mouseX;
    let mouseY = e.detail.mouseY;

    const relPos = Utils.calculateMouseRelativePosition(mouseX, mouseY, this.croppr.cropperEl);
    let { x, y } = this.constrainMouseToBoundaries(relPos.x, relPos.y);

    // Boostrap helpver variables
    let origin = this.activeHandle.origin.slice();
    const originX = this.activeHandle.originX;
    const originY = this.activeHandle.originY;
    const handle = this.activeHandle.handle;
    const TOP_MOVABLE = handle.constraints[0] === 1;
    const RIGHT_MOVABLE = handle.constraints[1] === 1;
    const BOTTOM_MOVABLE = handle.constraints[2] === 1;
    const LEFT_MOVABLE = handle.constraints[3] === 1;
    const MULTI_AXIS = (LEFT_MOVABLE || RIGHT_MOVABLE) &&
                       (TOP_MOVABLE || BOTTOM_MOVABLE);
    const currentBox = this.croppr.box;

    // Apply movement to respective sides according to the handle's constraint
    // values.
    let x1 = LEFT_MOVABLE || RIGHT_MOVABLE ? originX : currentBox.x1;
    let x2 = LEFT_MOVABLE || RIGHT_MOVABLE ? originX : currentBox.x2;
    let y1 = TOP_MOVABLE || BOTTOM_MOVABLE ? originY : currentBox.y1;
    let y2 = TOP_MOVABLE || BOTTOM_MOVABLE ? originY : currentBox.y2;
    x1 = LEFT_MOVABLE ? x : x1;
    x2 = RIGHT_MOVABLE ? x : x2;
    y1 = TOP_MOVABLE ? y : y1;
    y2 = BOTTOM_MOVABLE ? y : y2;

    if (this.isFlippedX(x)) {
      const tmp = x1; x1 = x2; x2 = tmp; // Swap x1 and x2;
      origin[0] = 1 - origin[0] // Flip origin
    }

    if (this.isFlippedY(y)) {
      const tmp = y1; y1 = y2; y2 = tmp; // Swap y1 and y2;
      origin[1] = 1 - origin[1] // Flip origin
    }

    let box = new Box(x1, y1, x2, y2);

    // Constrain aspect ratio
    if (this.croppr.options.aspectRatio) {
      const ratio = this.croppr.options.aspectRatio;
      let isVerticalMovement = false;

      if (MULTI_AXIS) {
        isVerticalMovement = (y > box.y1 + ratio * box.width()) || (y < box.y2 - ratio * box.width());
      } else if (TOP_MOVABLE || BOTTOM_MOVABLE) {
        isVerticalMovement = true;
      }

      const ratioMode = isVerticalMovement ? 'width' : 'height';
      box.constrainToRatio(ratio, <Point> origin, ratioMode);
    }

    // Constrain min/max size
    const min = this.croppr.options.minSize;
    const max = this.croppr.options.maxSize;
    box.constrainToSize(
      max.width,
      max.height,
      min.width,
      min.height,
      origin,
      this.croppr.options.aspectRatio
    );

    // Constrain to boundary
    const rect = this.croppr.cropperEl.getBoundingClientRect();
    box.constrainToBoundary(rect.width, rect.height, <Point> origin);

    this.eventBus.dispatchEvent(new CustomEvent('cropmove'));
    return box;
  }

  public onEnd(e) {
    this.eventBus.dispatchEvent(new CustomEvent('cropend'));
    return null;
  }

  /**
   * Constrain the relative mouse coordinates to be within the container.
   */
  private constrainMouseToBoundaries(x, y) {
    const container = this.croppr.cropperEl.getBoundingClientRect();

    if (x < 0) {
      x = 0;
    } else if (x > container.width) {
      x = container.width;
    }

    if (y < 0) {
      y = 0;
    } else if (y > container.height) {
      y = container.height;
    }

    return { x, y };
  }

  /**
   * Returns `true` if the user has dragged the x-axis past the active handle's
   * origin point.
   */
  private isFlippedX(x) {
    const LEFT_MOVABLE = this.activeHandle.handle.constraints[3] === 1;
    const RIGHT_MOVABLE = this.activeHandle.handle.constraints[1] === 1;

    if (LEFT_MOVABLE) {
      return x > this.activeHandle.originX;
    }

    if (RIGHT_MOVABLE) {
      return x < this.activeHandle.originX;
    }

    return false;
  }

  /**
   * Returns `true` if the user has dragged the y-axis past the active handle's
   * origin point.
   */
  private isFlippedY(y) {
    const TOP_MOVABLE = this.activeHandle.handle.constraints[0] === 1;
    const BOTTOM_MOVABLE = this.activeHandle.handle.constraints[2] === 1;

    if (TOP_MOVABLE) {
      return y > this.activeHandle.originY;
    }

    if (BOTTOM_MOVABLE) {
      return y < this.activeHandle.originY;
    }

    return false;
  }
}

export default onHandleMoveEngine;
