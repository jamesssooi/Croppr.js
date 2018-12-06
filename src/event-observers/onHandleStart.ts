import { HandleEvent } from '../types';
import EventBus from "../lib/event-bus";
import Core from "../core.new";

export default function onHandleStart(args: HandleEvent, eventBus: EventBus, croppr: Core) {
  // The scaling origin is defaulted to the opposite side of the current handle
  const scaleOrigin = [1 - args.handlePosition[0], 1 - args.handlePosition[1]];
  croppr.setInternalState({ handleScaleOrigin: scaleOrigin });
  eventBus.emit('onCropStart');
}
