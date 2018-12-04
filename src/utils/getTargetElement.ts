import isElement from './isElement';

/**
 * Return the first `Element` within the document that matches the specified
 * selector.
 */
export default function getTargetElement(element: HTMLElement | string) {
  if (isElement(element)) {
    return element;
  }

  element = <HTMLElement> document.querySelector(element);
  if (element == null) {
    throw 'Unable to find element.';
  }

  return element;
}
