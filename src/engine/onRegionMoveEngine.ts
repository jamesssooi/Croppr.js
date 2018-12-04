import CropprCore from "../core";
import Box from '../lib/box';
import { Engine } from '../types';

class onRegionMoveEngine implements Engine {

  private croppr: CropprCore;
  private eventBus: HTMLElement;
  private offsetPos: { offsetX: number; offsetY: number };

  /**
   * @constructor
   */
  constructor(eventBus: HTMLElement, croppr: CropprCore) {
    this.croppr = croppr;
    this.eventBus = eventBus;
    this.attachListeners();
  }

  /**
   * Attach listeners to the event bus.
   */
  private attachListeners() {
    this.eventBus.addEventListener('regionstart', e => {
      this.croppr.updateBox(this.onStart(e));
    });
    this.eventBus.addEventListener('regionmove', e => {
      this.croppr.updateBox(this.onMove(e));
    });
    this.eventBus.addEventListener('regionend', e => {
      this.croppr.updateBox(this.onEnd(e));
    });
  }

  /**
   * Handles when the user starts moving the crop region.
   */
  public onStart(e) {
    const { mouseX, mouseY } = e.detail;
    const containerRect = this.croppr.cropperEl.getBoundingClientRect();
    const relX = mouseX - containerRect.left;
    const relY = mouseY - containerRect.top;
    const offsetX = relX - this.croppr.box.x1;
    const offsetY = relY - this.croppr.box.y1;
    this.setOffsetPos(offsetX, offsetY);
    this.eventBus.dispatchEvent(new CustomEvent('cropstart'));
    return null;
  }

  /**
   * Handles when the user moves the crop region.
   */
  public onMove(e) {
    const { mouseX, mouseY } = e.detail;
    const { offsetX, offsetY } = this.offsetPos;

    // Calculate mouse's position in relative to the container
    const containerRect = this.croppr.cropperEl.getBoundingClientRect();
    const relX = mouseX - containerRect.left;
    const relY = mouseY - containerRect.top;

    // Move box
    const box = this.croppr.box.copy();
    box.move(relX - offsetX, relY - offsetY);

    // Constrain box
    if (box.x1 < 0) {
      box.move(0, null);
    }
    if (box.x2 > containerRect.width) {
      box.move(containerRect.width - box.width(), null);
    }
    if (box.y1 < 0) {
      box.move(null, 0);
    }
    if (box.y2 > containerRect.height) {
      box.move(null, containerRect.height - box.height());
    }

    this.eventBus.dispatchEvent(new CustomEvent('cropmove'));
    return box;
  }

  /**
   * Handles when user stops moving the crop region (mouse up).
   */
  public onEnd(e) {
    this.eventBus.dispatchEvent(new CustomEvent('cropend'));
    return null;
  }

  /**
   * Sets the offset position. The offset position will be used to calculate
   * the crop region's new position in relative
   */
  private setOffsetPos(x: number, y: number) {
    this.offsetPos = {
      offsetX: x,
      offsetY: y,
    };
  }

}

export default onRegionMoveEngine;