import Core from "../core.new";
import EventBus from "../lib/event-bus";
import { HandleEvent } from "../types";
import * as Utils from '../utils';
import Box from "../lib/box";

export default function onHandleMove(args: HandleEvent, eventBus: EventBus, croppr: Core) {
  let mouseX = args.mouseX;
  let mouseY = args.mouseY;
  const element = croppr.querySelector('.croppr');

  const relPos = Utils.calculateMouseRelativePosition(mouseX, mouseY, element);
  const rect = element.getBoundingClientRect();
  mouseX = Utils.constrainToRange(relPos.x, 0, rect.width);
  mouseY = Utils.constrainToRange(relPos.y, 0, rect.height);

  const internalState = croppr.getInternalState();
  const origin = internalState.handleScaleOrigin.slice();
  const originPos = croppr.box.getAbsolutePoint(origin);
  const TOP_MOVABLE = args.handleConstraints[0] === 1;
  const RIGHT_MOVABLE = args.handleConstraints[1] === 1;
  const BOTTOM_MOVABLE = args.handleConstraints[2] === 1;
  const LEFT_MOVABLE = args.handleConstraints[3] === 1;
  const MULTI_AXIS = (LEFT_MOVABLE || RIGHT_MOVABLE) &&
                      (TOP_MOVABLE || BOTTOM_MOVABLE);
  const currentBox = croppr.box;
 
  // Apply movement to respective sides according to handle's constraints
  let x1 = LEFT_MOVABLE || RIGHT_MOVABLE ? originPos[0] : currentBox.x1;
  let x2 = LEFT_MOVABLE || RIGHT_MOVABLE ? originPos[0] : currentBox.x2;
  let y1 = TOP_MOVABLE || BOTTOM_MOVABLE ? originPos[1] : currentBox.y1;
  let y2 = TOP_MOVABLE || BOTTOM_MOVABLE ? originPos[1] : currentBox.y2;
  x1 = LEFT_MOVABLE ? mouseX : x1;
  x2 = RIGHT_MOVABLE ? mouseX : x2;
  y1 = TOP_MOVABLE ? mouseY : y1;
  y2 = BOTTOM_MOVABLE ? mouseY : y2;

  if (_isFlippedX(mouseX, originPos[0], args.handleConstraints)) {
    const tmp = x1; x1 = x2; x2 = tmp; // Swap x1 and x2
    origin[0] = 1 - origin[0] // Flip origin
  }

  if (_isFlippedY(mouseY, originPos[1], args.handleConstraints)) {
    const tmp = y1; y1 = y2; y2 = tmp; // Swap y1 and y2
    origin[1] = 1 - origin[1] // Flip origin
  }

  const box = new Box(x1, y1, x2, y2);

  if (croppr.options.aspectRatio) {
    const ratio = croppr.options.aspectRatio;
    let isVerticalMovement = false;
    if (MULTI_AXIS) {
      isVerticalMovement = (mouseY > box.y1 + ratio * box.width()) || (mouseY < box.y2 - ratio * box.width());
    } else if (TOP_MOVABLE || BOTTOM_MOVABLE) {
      isVerticalMovement = true;
    }
    const ratioMode = isVerticalMovement ? 'width' : 'height';
    box.constrainToRatio(ratio, origin, ratioMode);
  }

  if (croppr.options.minSize || croppr.options.maxSize) {
    box.constrainToSize(
      croppr.options.maxSize.width,
      croppr.options.maxSize.height,
      croppr.options.minSize.width,
      croppr.options.minSize.height,
      origin,
      croppr.options.aspectRatio
    );
  }

  box.constrainToBoundary(rect.width, rect.height, origin);

  eventBus.emit('updateBox', box);
  eventBus.emit('onCropMove', box);
}


/**
 * Returns `true` if the user has dragged the x-axis past the active handle's
 * origin point.
 */
function _isFlippedX(x: number, originX: number, handleConstraints: number[]) {
  const LEFT_MOVABLE = handleConstraints[3] === 1;
  const RIGHT_MOVABLE = handleConstraints[1] === 1;

  if (LEFT_MOVABLE) {
    return x > originX;
  }

  if (RIGHT_MOVABLE) {
    return x < originX;
  }

  return false;
}


/**
 * Returns `true` if the user has dragged the y-axis past the active handle's
 * origin point.
 */
function _isFlippedY(y: number, originY: number, handleConstraints: number[]) {
  const TOP_MOVABLE = handleConstraints[0] === 1;
  const BOTTOM_MOVABLE = handleConstraints[2] === 1;

  if (TOP_MOVABLE) {
    return y > originY;
  }

  if (BOTTOM_MOVABLE) {
    return y < originY;
  }

  return false;
}