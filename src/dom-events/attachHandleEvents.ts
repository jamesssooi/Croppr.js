import EventBus from '../lib/event-bus';

/**
 * Listens for user interactions with the handle DOM elements and emit events to
 * the event bus for processing.
 */
export default function attachHandleEvents(handle: HTMLElement, eventBus: EventBus) {
  const position = JSON.parse(handle.getAttribute('data-position'));
  const constraints = JSON.parse(handle.getAttribute('data-constraints'));

  const onHandleMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    document.addEventListener('mousemove', onHandleMouseMove);
    document.addEventListener('mouseup', onHandleMouseUp);
    eventBus.emit('onHandleStart', {
      mouseX: e.clientX,
      mouseY: e.clientY,
      handlePosition: position,
      handleConstraints: constraints,
    });
  }
  
  const onHandleMouseMove = (e: MouseEvent) => {
    e.stopPropagation();
    eventBus.emit('onHandleMove', {
      mouseX: e.clientX,
      mouseY: e.clientY,
      handlePosition: position,
      handleConstraints: constraints,
    });
  }
  
  const onHandleMouseUp = (e: MouseEvent) => {
    e.stopPropagation();
    document.removeEventListener('mousemove', onHandleMouseMove);
    document.removeEventListener('mouseup', onHandleMouseUp);
    eventBus.emit('onHandleEnd', {
      mouseX: e.clientX,
      mouseY: e.clientY,
      handlePosition: position,
      handleConstraints: constraints,
    });
  }

  handle.addEventListener('mousedown', onHandleMouseDown);

  return () => {
    handle.removeEventListener('mousedown', onHandleMouseDown);
  }
}
