import { CropprOptions } from "./types";
import * as CONST from './lib/constants';
import * as Utils from './utils';

class Core {

  private handles: { element: HTMLElement, constraints: number[] }[];

  /**
   * @constructor
   */
  constructor(element: HTMLElement | string, options: CropprOptions, deferred = false) {
    const target = Utils.getTargetElement(element);

    if (target.getAttribute('src') === null) {
      throw 'Image src not provided.'
    }

    if (!deferred) {
      this.initialize(target);
    }
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
    const root = DOMBuilders.createRootDOM();
    DOMBuilders.createImageDOM(root, imageSrc, imageAlt);
    DOMBuilders.createCropRegionDOM(root);
    DOMBuilders.createOverlayDOM(root);
    DOMBuilders.createHandlesDOM(root);
    return root;
  }

  /**
   * Create and returns default handles' DOM elements;
   */
  private createHandles() {
    return CONST.DEFAULT_HANDLES.map(handle => {
      const element = document.createElement('div');
      element.className = 'croppr-handle';
      element.style.cursor = handle.cursor;
      return { element, constraints: handle.constraints }
    });
  }

}

export default Core;
