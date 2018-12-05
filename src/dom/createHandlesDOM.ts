import * as CONST from '../lib/constants';

/**
 * Creates and appends the handles to the `root` element.
 */
export default function createHandlesDOM(root: HTMLElement): HTMLElement {
  const container = document.createElement('div')
  container.className = 'croppr-handleContainer';

  CONST.DEFAULT_HANDLES.forEach(handle => {
    const element = document.createElement('div');
    element.className = 'croppr-handle';
    element.style.cursor = handle.cursor;
    element.setAttribute('data-constraints', JSON.stringify(handle.constraints));
    container.appendChild(element);
  });

  root.appendChild(container);
  return root;
}
