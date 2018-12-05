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
  private handles: { element: HTMLElement, constraints: number[], position: number[] }[];
  private eventBus: EventBus;
  private _oldElement: Element;
  private element: HTMLElement;

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
    this.element = cropprDOM;

    // Store handles for easier access later
    const handles = [];
    cropprDOM.querySelectorAll('.croppr-handle').forEach(handle => {
      handles.push({
        element: <HTMLElement> handle,
        position: JSON.parse(handle.getAttribute('data-position')),
        constraints: JSON.parse(handle.getAttribute('data-constraints')),
      });
      handle.removeAttribute('data-constraints');
    });
    this.handles = handles;

    // Process options
    this._rawOptions = { ...options };
    const mergedOptions = { ...Core.defaultOptions, ...options };
    this.options = this.convertOptionValuesToAbsolute(mergedOptions, cropprDOM);

    // Create default crop region
    this.box = this.getInitialBox(this.options);
    this.redraw();
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

  /**
   * Returns a default crop region.
   */
  private getInitialBox(opts: Options) {
    const box = new Box(0, 0, opts.startSize.width, opts.startSize.height);

    if (opts.aspectRatio !== null) {
      box.constrainToRatio();
    }

    if (opts.minSize !== null || opts.maxSize !== null) {
      const min = opts.minSize;
      const max = opts.maxSize;
      box.constrainToSize(
        max.width, max.height, min.width, min.height, [0.5, 0.5], opts.aspectRatio
      );
    }

    const rootDOM = this.querySelector('.croppr');
    const rootRect = rootDOM.getBoundingClientRect();
    box.constrainToBoundary(rootRect.width, rootRect.height, [.5, .5]);

    // Move to center
    const x = (rootRect.width / 2) - (box.width() / 2);
    const y = (rootRect.height / 2) - (box.height() / 2);
    box.move(x, y);

    return box;
  }

  /**
   * Redraw elements according to the internal box model.
   */
  public redraw() {
    const width = Math.round(this.box.width());
    const height = Math.round(this.box.height());
    const x1 = Math.round(this.box.x1);
    const y1 = Math.round(this.box.y1);
    const x2 = Math.round(this.box.x2);
    const y2 = Math.round(this.box.y2);

    window.requestAnimationFrame(() => {
      this.redrawCropRegion(x1, y1, width, height);
      this.redrawImageClippedRegion(x1, y1, x2, y2);
      this.redrawHandles(x1, y1, width, height);
    });
  }

  private redrawCropRegion(x1: number, y1: number, width: number, height: number) {
    const cropRegion = this.querySelector('.croppr-region');
    cropRegion.style.transform = `translate(${x1}px, ${y1}px)`;
    cropRegion.style.width = `${width}px`;
    cropRegion.style.height = `${height}px`;
  }

  private redrawImageClippedRegion(x1: number, y1: number, x2: number, y2: number) {
    const imageClip = this.querySelector('.croppr-imageClipped');
    imageClip.style.clip = `rect(${y1}px, ${x2}px, ${y2}px, ${x1}px)`;
  }

  private redrawHandles(x1: number, y1: number, width: number, height: number) {
    const topHandleIndex = this.getTopHandleIndex();
    this.handles.forEach((handle, index) => {
      const left = Math.round(x1 + width * handle.position[0]);
      const top = Math.round(y1 + height * handle.position[1]);
      handle.element.style.transform = `translate(${left}px, ${top}px)`;
      handle.element.style.zIndex = index === topHandleIndex ? '5' : '4';
    });
  }

  /**
   * Calculate which handle to have the highest z-index.
   */
  private getTopHandleIndex() {
    const rootDOM = this.querySelector('.croppr');
    const center = this.box.getAbsolutePoint([.5, .5]);
    
    // Calculates the quadrant the box is in using bitwise operators.
    // @see https://stackoverflow.com/questions/9718059
    const xSign = (center[0] - rootDOM.offsetWidth / 2) >> 31;
    const ySign = (center[1] - rootDOM.offsetHeight / 2) >> 31;
    const quadrant = (xSign ^ ySign) + ySign + ySign + 4;

    // Calculate which handle index to bring forward. This equation is derived
    // using algebra. TODO: Refactor this, because it is cryptic af and breaks
    // if the order of the handles are changed.
    return -2 * quadrant + 8;
  }

  private _querySelectorCache: { [key: string]: HTMLElement } = {};

  /**
   * Returns the first `Element` within Croppr's DOM that matches the specified
   * selector. This method is memoized.
   */
  private querySelector(selector: string) {
    if (this._querySelectorCache.hasOwnProperty(selector)) {
      return this._querySelectorCache[selector];
    }

    const element = <HTMLElement> this.element.querySelector(selector);
    if (element !== null) {
      this._querySelectorCache[selector] = element;
    }

    return element;
  }

}

export default Core;
