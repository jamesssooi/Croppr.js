/**
 * Represents a point of origin.
 */
interface OriginPoint extends Array<number> {
  0: number
  1: number
}


/**
 * Represents the axis to grow.
 */
type GrowSide = 'width' | 'height';


/**
 * Represents a crop region.
 */
class Box {

  public x1: number;
  public y1: number;
  public x2: number;
  public y2: number;

  /**
   * @constructor
   */
  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  /**
   * Sets the new dimensions of the box.
   */
  public set(x1: number = null, y1: number = null, x2: number = null, y2: number = null) {
    this.x1 = x1 == null ? this.x1 : x1;
    this.y1 = y1 == null ? this.y1 : y1;
    this.x2 = x2 == null ? this.x2 : x2;
    this.y2 = y2 == null ? this.y2 : y2;
    return this;
  }

  /**
   * Returns a copy of this box.
   */
  public copy(): Box {
    return new Box(this.x1, this.y1, this.x2, this.y2);
  }

  /**
   * Calculates the width of the box.
   */
  public width() {
    return Math.abs(this.x2 - this.x1);
  }

  /**
   * Calculates the height of the box.
   */
  public height() {
    return Math.abs(this.y2 - this.y1);
  }

  /**
   * Resizes the box to a new size.
   */
  public resize(newWidth: number, newHeight: number, origin: OriginPoint) {
    const fromX = this.x1 + (this.width() * origin[0]);
    const fromY = this.y1 + (this.height() * origin[1]);
    this.x1 = fromX - (newWidth * origin[0]);
    this.y1 = fromY - (newHeight * origin[1]);
    this.x2 = this.x1 + newWidth;
    this.y2 = this.y1 + newHeight;
    return this;
  }

  /**
   * Scale the box by a factor.
   */
  public scale(factor: number, origin: OriginPoint = [0, 0]) {
    const newWidth = this.width() * factor;
    const newHeight = this.height() * factor;
    this.resize(newWidth, newHeight, origin);
    return this;
  }

  /**
   * Move the box to the specified coordinates.
   */
  public move(x: number = null, y: number = null) {
    const width = this.width();
    const height = this.height();
    x = x === null ? this.x1 : x;
    y = y === null ? this.y1 : y;
    this.x1 = x;
    this.y1 = y;
    this.x2 = x + width;
    this.y2 = y + height;
    return this;
  }

  /**
   * Get relative x and y coordinates of a given point within the box.
   */
  getRelativePoint(point: OriginPoint = [0, 0]) {
    const x = this.width() * point[0];
    const y = this.height() * point[1];
    return [x, y];
  }

  /**
   * Get absolute x and y coordinates of a given point within the box.
   */
  public getAbsolutePoint(point: OriginPoint = [0, 0]) {
    const x = this.x1 + this.width() * point[0];
    const y = this.y1 + this.height() * point[1];
    return [x, y];
  }

  /**
   * Constrain the box to a fixed ratio.
   *
   * `grow` is a string enum specifiying which axis should the box grow to
   * constrain to the ratio.
   */
  public constrainToRatio(ratio: number = null, origin: OriginPoint = [0, 0], grow: GrowSide = 'height') {
    if (ratio === null) {
      return;
    }

    switch (grow) {
      case 'height': // Grow height only
        this.resize(this.width(), this.width() * ratio, origin);
        break;
      case 'width': // Grow width only
        this.resize(this.height() * 1 / ratio, this.height(), origin);
        break;
      default: // Default: Grow height only
        this.resize(this.width(), this.width() * ratio, origin);
    }

    return this;
  }

  /**
   * Constrain the box within a boundary.
   */
  public constrainToBoundary(boundaryWidth: number, boundaryHeight: number, origin: OriginPoint = [0, 0]) {
    // Calculate the maximum sizes for each direction of growth
    const [originX, originY] = this.getAbsolutePoint(origin);
    const maxIfLeft = originX
    const maxIfTop = originY
    const maxIfRight = boundaryWidth - originX
    const maxIfBottom = boundaryHeight - originY

    // Express the direction of growth in terms of left, both,
    // and right as -1, 0, and 1 respectively. Ditto for top/both/down.
    const directionX = -2 * origin[0] + 1;
    const directionY = -2 * origin[1] + 1;

    // Determine the max size to use according to the direction of growth.
    let [maxWidth, maxHeight] = [null, null];
    switch (directionX) {
      case -1: maxWidth = maxIfLeft; break;
      case 0: maxWidth = Math.min(maxIfLeft, maxIfRight) * 2; break;
      case +1: maxWidth = maxIfRight; break;
    }
    switch (directionY) {
      case -1: maxHeight = maxIfTop; break;
      case 0: maxHeight = Math.min(maxIfTop, maxIfBottom) * 2; break;
      case +1: maxHeight = maxIfBottom; break;
    }

    // Resize if the box exceeds the calculated max width/height.
    if (this.width() > maxWidth) {
      const factor = maxWidth / this.width();
      this.scale(factor, origin);
    }
    if (this.height() > maxHeight) {
      const factor = maxHeight / this.height();
      this.scale(factor, origin);
    }

    return this;
  }

  /**
   * Constrain the box to a maximum/minimum size.
   */
  public constrainToSize(
    maxWidth: number = null,
    maxHeight: number = null,
    minWidth: number = null,
    minHeight: number = null,
    origin: OriginPoint = [0, 0],
    ratio: number = null
  ) {
    // Calculate new max/min widths & heights that constrains to the ratio
    if (ratio) {
      if (ratio > 1) {
        maxWidth = maxHeight * 1 / ratio;
        minHeight = minHeight * ratio;
      } else if (ratio < 1) {
        maxHeight = maxWidth * ratio;
        minWidth = minHeight * 1 / ratio;
      }
    }

    if (maxWidth && this.width() > maxWidth) {
      const newWidth = maxWidth,
        newHeight = ratio === null ? this.height() : maxHeight;
      this.resize(newWidth, newHeight, origin);
    }

    if (maxHeight && this.height() > maxHeight) {
      const newWidth = ratio === null ? this.width() : maxWidth,
        newHeight = maxHeight;
      this.resize(newWidth, newHeight, origin);
    }

    if (minWidth && this.width() < minWidth) {
      const newWidth = minWidth,
        newHeight = ratio === null ? this.height() : minHeight;
      this.resize(newWidth, newHeight, origin);
    }

    if (minHeight && this.height() < minHeight) {
      const newWidth = ratio === null ? this.width() : minWidth,
        newHeight = minHeight;
      this.resize(newWidth, newHeight, origin);
    }

    return this;
  }
}

export default Box;
