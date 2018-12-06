import { HandleEvent } from "../types";
import EventBus from "../lib/event-bus";
import Core from "../core.new";

export default function onHandleEnd(args: HandleEvent, eventBus: EventBus, croppr: Core) {
  croppr.setInternalState({ handleScaleOrigin: null });
  eventBus.emit('onCropEnd');
}
