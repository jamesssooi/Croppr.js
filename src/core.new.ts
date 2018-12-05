import { CropprOptions, Size } from "./types";
import EventBus from './lib/event-bus';
import * as CONST from './lib/constants';
import * as Utils from './utils';
import * as DOMBuilders from './dom';
import Box from "./lib/box";

interface Options {
  aspectRatio?: number
  maxSize?: { width: number; height: number; mode?: 'px' | '%' }
  minSize?: { width: number; height: number; mode?: 'px' | '%' }
  startSize?: { width: number; height: number; mode?: 'px' | '%' }
  onCropStart?(data: { x: number; y: number; width: number; height: number }): void
  onCropMove?(data: { x: number; y: number; width: number; height: number }): void
  onCropEnd?(data: { x: number; y: number; width: number; height: number }): void
  onInitialize?(instance: Core): void
  convertToPixels?(element: HTMLElement): void
  returnMode?: 'real' | 'ratio' | 'raw'
}

class Core {

  static defaultOptions: Partial<Options> = {
    aspectRatio: null,
    maxSize: null,
    minSize: null,
    startSize: { width: 100, height: 100, mode: '%' },
    returnMode: 'real',
    onInitialize: null,
    onCropStart: null,
    onCropMove: null,
    onCropEnd: null,
  }

  private options: Options;
  private _rawOptions: Options;
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
  constructor(element: HTMLElement | string, options: Options, deferred = false) {
    const target = Utils.getTargetElement(element);

    if (target.getAttribute('src') === null) {
      throw 'Image src not provided.'
    }

    if (!deferred) {
      this.initialize(target, options);
    }
  }

  /**
   * Initialize the Croppr instance.
   */
  private initialize(element: HTMLElement, options: Options) {
    // Defer this function until image has loaded
    if (element['width'] === 0 || element['height'] === 0) {
      element.onload = () => this.initialize(element, options);
      return;
    }

    this.eventBus = new EventBus();

    // Create DOM
    this._oldElement = element;
    const imageSrc = element.getAttribute('src');
    const imageAlt = element.getAttribute('alt');
    const cropprDOM = this.constructDOMTree(this.eventBus, imageSrc, imageAlt);
    element.parentElement.replaceChild(cropprDOM, element);

    // Process options
    this._rawOptions = { ...options };
    const mergedOptions = { ...Core.defaultOptions, ...options };
    this.options = this.convertOptionValuesToAbsolute(mergedOptions, cropprDOM);
  }

  /**
   * Constructs and returns Croppr's DOM elements.
   */
  private constructDOMTree(eventBus: EventBus, imageSrc: string, imageAlt: string) {
    const container = document.createElement('div');
    container.className = 'croppr-container';

    const root = DOMBuilders.createRootDOM(eventBus);
    DOMBuilders.createImageDOM(root, eventBus, imageSrc, imageAlt);
    DOMBuilders.createCropRegionDOM(root, eventBus);
    DOMBuilders.createOverlayDOM(root, eventBus);
    DOMBuilders.createHandlesDOM(root, eventBus);

    container.appendChild(root);
    return container;
  }

  /**
   * Convert percentage values in options to absolute values.
   */
  private convertOptionValuesToAbsolute(options: Options, root: HTMLElement) {
    const opts = { ...options };
    const rootWidth = root.offsetWidth;
    const rootHeight = root.offsetHeight;

    if (opts.maxSize !== null && opts.maxSize.mode === '%') {
      opts.maxSize.width = (opts.maxSize.width / 100) * rootWidth;
      opts.maxSize.height = (opts.maxSize.height / 100) * rootHeight;
      opts.maxSize.mode = 'px';
    }

    if (opts.minSize !== null && opts.minSize.mode === '%') {
      opts.minSize.width = (opts.minSize.width / 100) * rootWidth;
      opts.minSize.height = (opts.minSize.height / 100) * rootHeight;
      opts.minSize.mode = 'px';
    }

    if (opts.startSize !== null && opts.startSize.mode === '%') {
      opts.startSize.width = (opts.startSize.width / 100) * rootWidth;
      opts.startSize.height = (opts.startSize.height / 100) * rootHeight;
      opts.startSize.mode = 'px';
    }

    return opts;
  }

}

export default Core;
