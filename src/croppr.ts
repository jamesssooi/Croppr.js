/**
 * Croppr.js
 * https://github.com/jamesssooi/Croppr.js
 * 
 * A JavaScript image cropper that's lightweight, awesome, and has
 * zero dependencies.
 * 
 * (C) 2018 James Ooi. Released under the MIT License.
 */
import { CropprOptions, Point } from './types';
import CropprCore from './core';
import Box from './lib/box';


class Croppr extends CropprCore {

  private box: Box;
  private options: CropprOptions;

  /**
   * @constructor
   */
  constructor(element: Element, options: CropprOptions, _deferred = false) {
    super(element, options, _deferred);
  }

  /**
   * Gets the value of the crop region.
   */
  public getValue(mode?: 'real' | 'ratio' | 'raw') {
    return super.getValue(mode);
  }

  /**
   * Changes the image src.
   */
  public setImage(src: string) {
    return super.setImage(src);
  }

  /**
   * Destroys the Croppr instance.
   */
  public destroy() {
    return super.destroy();
  }

  /**
   * Moves the crop region to a specified position.
   */
  public moveTo(x: number, y: number) {
    this.box.move(x, y);
    this.redraw();

    // Call the callback
    if (this.options.onCropEnd !== null) {
      this.options.onCropEnd(this.getValue());
    }

    return this;
  }

  /**
   * Resizes the crop region to a specified width and height. You may optionally
   * specify a point of origin to resize from. Defaults to `[.5, .5]` (center).
   */
  public resizeTo(width: number, height: number, origin: Point = [.5, .5]) {
    this.box.resize(width, height, origin);
    this.redraw();

    // Call the callback
    if (this.options.onCropEnd !== null) {
      this.options.onCropEnd(this.getValue());
    }

    return this;
  }

  /**
   * Scales the crop region by a factor. You may optionally specify a point of
   * origin to resize from. Defaults to `[.5, .5]` (center).
   */
  public scaleBy(factor: number, origin: Point = [.5, .5]) {
    this.box.scale(factor, origin);
    this.redraw();

    // Call the callback
    if (this.options.onCropEnd !== null) {
      this.options.onCropEnd(this.getValue());
    }

    return this;
  }

  /**
   * Resets the crop region to the initial settings.
   */
  public reset() {
    this.box = this.initializeBox(this.options);
    this.redraw();

    // Call the callback
    if (this.options.onCropEnd !== null) {
      this.options.onCropEnd(this.getValue());
    }

    return this;
  }
}

export default Croppr;