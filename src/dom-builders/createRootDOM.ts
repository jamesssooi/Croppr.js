import EventBus from "../lib/event-bus";

/**
 * Construct Croppr's root DOM elements.
 */
export default function createRootDOM(eventBus: EventBus): HTMLElement {
  const element = document.createElement('div');
  element.className = 'croppr';
  return element;
}
