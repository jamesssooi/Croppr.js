import { CropprOptions } from "./types";
import EventBus from './lib/event-bus';
import * as CONST from './lib/constants';
import * as Utils from './utils';
import * as DOMBuilders from './dom';
import Box from "./lib/box";

class Core {

  private handles: { element: HTMLElement, constraints: number[] }[];
  private eventBus: EventBus;
  private _oldElement: Element;

  /**
   * The crop region's internal model. Any modification to the crop region
   * should be made to this `box` variable.
   */
  private box: Box;

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

    this.eventBus = new EventBus();

    // Create DOM
    const imageSrc = element.getAttribute('src');
    const imageAlt = element.getAttribute('alt');
    const rootDOM = this.constructDOMTree(this.eventBus, imageSrc, imageAlt);
    element.parentElement.replaceChild(rootDOM, element);
    this._oldElement = element;
  }

  /**
   * Constructs and returns Croppr's DOM elements.
   */
  private constructDOMTree(eventBus: EventBus, imageSrc: string, imageAlt: string) {
    const root = DOMBuilders.createRootDOM(eventBus);
    DOMBuilders.createImageDOM(root, eventBus, imageSrc, imageAlt);
    DOMBuilders.createCropRegionDOM(root, eventBus);
    DOMBuilders.createOverlayDOM(root, eventBus);
    DOMBuilders.createHandlesDOM(root, eventBus);
    return root;
  }

}

export default Core;
