//  credits to https://github.com/ma3a/SDH-PlayTime

import { ServerAPI } from "decky-frontend-lib";
import logger from "../utils";
import { Game } from "./model";
import { EventBus } from "./system";

export class Backend {
  private serverApi: ServerAPI;
  private eventBus: EventBus;

  constructor(eventBus: EventBus, serverApi: ServerAPI) {
    this.eventBus = eventBus;
    this.serverApi = serverApi;
    let instance = this;
    eventBus.addSubscriber(async (event) => {
      switch (event.type) {
        case "GameStarted":
          await instance.changeGame(event.game);
          break;

        case "GameStopped":
          await instance.changeGame({
            id: "Unknown",
            name: "STEAM",
          });
          break;

        case "ResumeFromSuspend":
          if (event.game) {
            await instance.changeGame(event.game);
          } else {
            await instance.changeGame({
              id: "Unknown",
              name: "STEAM",
            });
          }
          break;

        case "Suspended":
          await instance.changeGame({
            id: "Unknown",
            name: "STEAM",
          });
          break;

        case "Unmount":
          break;
      }
    });
  }

  private async changeGame(game: Game) {
    await this.serverApi
      .callPluginMethod<
        {
          game_id: string;
          game_name: string;
        },
        void
      >("set_game", {
        game_id: game.id,
        game_name: game.name,
      })
      .then((r) => {
        if (!r.success) {
          this.errorOnBackend(
            "Can't change game_id, because of backend error (changeGameId)"
          );
        }
      })
      .catch((_) => {
        this.errorOnBackend(
          "Can't change game_id, because of backend error (changeGameId)"
        );
      });
  }

  private errorOnBackend(message: string) {
    logger.error(`There is an error: ${message}`);
    this.eventBus.emit({
      type: "NotifyAboutError",
      message: message,
    });
  }
}
