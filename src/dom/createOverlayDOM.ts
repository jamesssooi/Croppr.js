/**
 * Creates and appends the black overlay element to the `root` element.
 */
export default function createOverlayDOM(root: HTMLElement) {
  const overlay = document.createElement('div');
  overlay.className = 'croppr-overlay';
  root.appendChild(overlay);
  return root;
}
