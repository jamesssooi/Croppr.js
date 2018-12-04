import Croppr from './croppr';
import CropprCore from './core';
import Box from './lib/box';

export interface CropprOptions {
  aspectRatio?: number;
  maxSize?: Size;
  minSize?: Size;
  startSize?: Size;
  onCropStart?(data: CropValue): void;
  onCropMove?(data: CropValue): void;
  onCropEnd?(data: CropValue): void;
  onInitialize?(instance: Croppr): void;
  convertToPixels?(element: HTMLElement): void;
  returnMode?: 'real' | 'ratio' | 'raw';
}

/**
 * An engine processes user inputs and returns a new crop region.
 */
export interface Engine {
  onStart?(e: any): Box | null
  onMove?(e: any): Box | null
  onEnd?(e: any): Box | null
}

/**
 * Represents a width and a height value. May optionally include a third value
 * denoting whether this value is in 'px' or in '%'.
 */
export interface Size extends Array<number | string> {
  0: number
  1: number
  2?: 'px' | '%'
}

export type CropValue = {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Represents an x and y position.
 */
export interface Point extends Array<number> {
  0: number
  1: number
}

/**
 * Represents the side of the crop region that is to be affected by this handle.
 * Accepts a value of 0 or 1 in the order of [TOP, RIGHT, BOTTOM, LEFT].
 */
export interface HandleConstraints extends Array<number> {
  0: number
  1: number
  2: number
  3: number
}
