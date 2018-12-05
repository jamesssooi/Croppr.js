import EventBus from "../lib/event-bus";

/**
 * Creates and appends the crop region element to the `root` element.
 */
export default function createCropRegionDOM(root: HTMLElement, eventBus: EventBus): HTMLElement {
  const cropRegion = document.createElement('div');
  cropRegion.className = 'croppr-region';
  root.appendChild(cropRegion);
  return root;
}
