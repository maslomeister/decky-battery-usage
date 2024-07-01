import {
  definePlugin,
  ServerAPI,
  staticClasses,
  SteamClient,
} from "decky-frontend-lib";
import { FaCarBattery } from "react-icons/fa";
import {
  Clock,
  EventBus,
  Mountable,
  MountManager,
  systemClock,
} from "./app/system";
import { Backend } from "./app/backend";
import { SteamEventMiddleware } from "./app/middleware";
import { AppInfoStore, AppStore } from "./app/model";
import { DeckyPanelPage } from "./pages/DeckyPanelPage";
declare global {
  // @ts-ignore
  let SteamClient: SteamClient;
  let appStore: AppStore;
  let appInfoStore: AppInfoStore;
}

export default definePlugin((serverApi: ServerAPI) => {
  console.log("BatteryUsage plugin loading...");
  let clock = systemClock;
  let eventBus = new EventBus();
  let backend = new Backend(eventBus, serverApi);

  let mountManager = new MountManager(eventBus, clock);
  let mounts = createMountables(eventBus, backend, clock, serverApi);
  mounts.forEach((m) => mountManager.addMount(m));

  mountManager.mount();
  return {
    title: <div className={staticClasses.Title}>PlayTime</div>,
    content: <DeckyPanelPage serverApi={serverApi} />,
    icon: <FaCarBattery />,
    onDismount() {
      mountManager.unMount();
    },
  };
});

function createMountables(
  eventBus: EventBus,
  backend: Backend,
  clock: Clock,
  serverApi: ServerAPI
): Mountable[] {
  eventBus.addSubscriber((event) => {
    switch (event.type) {
      case "NotifyAboutError":
        serverApi.toaster.toast({
          body: <div>{event.message}</div>,
          title: "BatterUsage: error",
          icon: <FaCarBattery />,
          duration: 2 * 1000,
          critical: true,
        });
        break;
    }
  });
  let mounts: Mountable[] = [];
  mounts.push(new SteamEventMiddleware(eventBus, clock));
  return mounts;
}
