/**
 * Return a value that is constrained to a specified range of values.
 */
export default function constrainToRange(value: number, min: number, max: number) {
  if (value < min) {
    return 0;
  } else if (value > max) {
    return max;
  }
  return value;
}
