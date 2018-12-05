import EventBus from "../lib/event-bus";

/**
 * Creates and appends the black overlay element to the `root` element.
 */
export default function createOverlayDOM(root: HTMLElement, eventBus: EventBus) {
  const overlay = document.createElement('div');
  overlay.className = 'croppr-overlay';
  root.appendChild(overlay);
  return root;
}
