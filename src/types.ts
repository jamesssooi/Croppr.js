
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
