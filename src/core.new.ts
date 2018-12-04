import { CropprOptions } from "./types";
import * as Utils from './utils';

class Core {

  /**
   * @constructor
   */
  constructor(element: HTMLElement | string, options: CropprOptions, deferred = false) {
    const target = this.getTargetElement(element);

    if (target.getAttribute('src') === null) {
      throw 'Image src not provided.'
    }

    if (!deferred) {
      this.initialize(target);
    }
  }

  /**
   * Returns the targeted element.
   */
  private getTargetElement(element: HTMLElement | string) {
    if (Utils.isElement(element)) {
      return element;
    }

    element = <HTMLElement> document.querySelector(element);
    if (element == null) {
      throw 'Unable to find element.';
    }

    return element;
  }

  /**
   * Initialize the Croppr instance.
   */
  private initialize(element: HTMLElement) {
    // Defer this function until image has loaded
    if (element['width'] === 0 || element['height'] === 0) {
      element.onload = () => this.initialize(element);
      return;
    }

    const imageSrc = element.getAttribute('src');
    const imageAlt = element.getAttribute('alt');
    const rootDOM = this.constructDOMTree(imageSrc, imageAlt);
    element.parentElement.replaceChild(rootDOM, element);
  }

  /**
   * Constructs and returns Croppr's DOM elements.
   */
  private constructDOMTree(imageSrc: string, imageAlt: string) {
    const root = document.createElement('div');
    root.className = 'croppr-container';
    root.innerHTML = `
      <div class="croppr">
        <img src="${imageSrc}" class="croppr-image" alt="${imageAlt}"/>
        <img src="${imageSrc}" class="croppr-imageClipped" role="presentation"/>
        <div class="croppr-region"></div>
        <div class="croppr-overlay"></div>
        <div class="croppr-handleContainer"></div>
      </div>`;
    return root;
  }

}

export default Core;
