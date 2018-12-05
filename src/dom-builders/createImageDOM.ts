
import EventBus from '../lib/event-bus';

/**
 * Creates and appends the image elements to the `root` element.
 */
export default function createImageDOM(root: HTMLElement, eventBus: EventBus, imageSrc: string, imageAlt?: string): HTMLElement {
  const img = document.createElement('img');
  img.src = imageSrc;
  img.alt = imageAlt;
  img.className = 'croppr-image';

  const imgClipped = document.createElement('img');
  imgClipped.src = imageSrc;
  imgClipped.alt = imageAlt;
  imgClipped.className = 'croppr-imageClipped';

  root.appendChild(img);
  root.appendChild(imgClipped);
  return root;
}
