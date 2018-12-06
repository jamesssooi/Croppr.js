import Core from "../core.new";

interface EventBusListener {
  (eventArgs?: any, eventBus?: EventBus, croppr?: Core): void
}

/**
 * `EventBus` is a very simple event emitter.
 */
class EventBus {

  private croppr: Core;
  private events: { [key: string]: EventBusListener[] }

  /**
   * @constructor
   */
  constructor(croppr: Core) {
    this.croppr = croppr;
    this.events = {};
  }

  /**
   * Subscribe to an event.
   */
  public on(eventName: string, listener: EventBusListener) {
    if (!this.events.hasOwnProperty(eventName)) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  /**
   * Emit an event.
   */
  public emit(eventName: string, eventArgs?: any) {
    if (this.events.hasOwnProperty(eventName)) {
      this.events[eventName].forEach(f => f(eventArgs, this, this.croppr));
    }
  }

}

export default EventBus;
