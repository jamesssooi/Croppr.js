
/**
 * Returns `true` if provided object is an Element.
 */
export default function isElement(element: HTMLElement | string): element is HTMLElement {
  return element['nodeName'] !== undefined;
}
