/**
 * Creates and appends the crop region element to the `root` element.
 */
export default function createCropRegionDOM(root: HTMLElement): HTMLElement {
  const cropRegion = document.createElement('div');
  cropRegion.className = 'croppr-region';
  root.appendChild(cropRegion);
  return root;
}
