// Type definitions for Croppr.js
// Definitions by: James Ooi https://github.com/jamesssooi
// Based on the template: https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html


/*~ Expose this module as a UMD */
export as namespace Croppr;

/*~ Specify the class constructor function */
export = Croppr;


declare class Croppr {

  /** @constructor */
  constructor(element: string | HTMLElement, options?: Croppr.CropprOptions, deferred?: boolean)

  /** Gets the value of the crop region */
  getValue(mode?: "real" | "ratio" | "raw"): Croppr.CropprValue

  /** Destroys the Croppr instance */
  destroy(): void

  /** Moves the crop region to a specified coordinate */
  moveTo(x: number, y: number): Croppr

  /** Resizes the crop region to a specified width and height */
  resizeTo(width: number, height: number, origin?: Array<number>): Croppr

  /** Scale the crop region by a factor */
  scaleBy(factor: number, origin?: Array<number>): Croppr

  /** Resets the crop region to the initial settings */
  reset(): Croppr
}

/*~ Declare type modules */
declare namespace Croppr {

  export interface CropprOptions {
    aspectRatio?: number;
    maxSize?: Array<any>;
    minSize?: Array<any>;
    startSize?: Array<any>;
    onCropStart?(data: Croppr.CropprValue): void;
    onCropMove?(data: Croppr.CropprValue): void;
    onCropEnd?(data: Croppr.CropprValue): void;
    onInitialize?(instance: Croppr): void;
    returnMode?: "real" | "ratio" | "raw";
  }

  export interface CropprValue {
    x: number;
    y: number;
    width: number;
    height: number
  }

}
