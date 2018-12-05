import * as CONST from '../lib/constants';
import EventBus from '../lib/event-bus';

/**
 * Creates and appends the handles to the `root` element.
 */
export default function createHandlesDOM(root: HTMLElement, eventBus: EventBus): HTMLElement {
  const container = document.createElement('div')
  container.className = 'croppr-handleContainer';

  CONST.DEFAULT_HANDLES.forEach(handle => {
    const element = document.createElement('div');
    element.className = 'croppr-handle';
    element.style.cursor = handle.cursor;
    element.setAttribute('data-constraints', JSON.stringify(handle.constraints));
    element.setAttribute('data-position', JSON.stringify(handle.position));
    container.appendChild(element);
  });

  root.appendChild(container);
  return root;
}
