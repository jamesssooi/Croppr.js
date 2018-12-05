/**
 * `EventBus` is a very simple event emitter.
 */
class EventBus {

  private events: { [key: string]: Function[] }

  /**
   * @constructor
   */
  constructor() {
    this.events = {};
  }

  /**
   * Subscribe to an event.
   */
  public on(eventName: string, listener: Function) {
    if (!this.events.hasOwnProperty(eventName)) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  /**
   * Emit an event.
   */
  public emit(eventName: string, ...eventArgs: any[]) {
    if (this.events.hasOwnProperty(eventName)) {
      this.events[eventName].forEach(f => f(eventArgs));
    }
  }

}

export default EventBus;
