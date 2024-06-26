//  credits to https://github.com/ma3a/SDH-PlayTime

import logger from "../utils";
import { Events } from "./events";

export { Clock, EventBus, MountManager, systemClock, Mountable };

let systemClock = {
  getTimeMs() {
    return Date.now();
  },
} as Clock;

interface Clock {
  getTimeMs: () => number;
}

interface Mountable {
  mount: () => void;
  unMount: () => void;
}

class MountManager {
  private mounts: Array<Mountable> = [];
  private eventBus: EventBus;
  private clock: Clock;

  constructor(eventBus: EventBus, clock: Clock) {
    this.eventBus = eventBus;
    this.clock = clock;
  }

  addMount(mount: Mountable) {
    this.mounts.push(mount);
  }

  mount() {
    this.mounts.forEach((mount) => mount.mount());
    this.eventBus.emit({
      type: "Mount",
      createdAt: this.clock.getTimeMs(),
      mounts: this.mounts,
    });
  }

  unMount() {
    this.mounts.forEach((mount) => mount.unMount());
    this.eventBus.emit({
      type: "Unmount",
      createdAt: this.clock.getTimeMs(),
      mounts: this.mounts,
    });
  }
}

class EventBus {
  private subscribers: ((event: Events) => void)[] = [];

  public emit(event: Events) {
    logger.info("New event", event);
    this.subscribers.forEach((it) => {
      it(event);
    });
  }

  public addSubscriber(subscriber: (event: Events) => void) {
    this.subscribers.push(subscriber);
  }
}
