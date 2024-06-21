//  credits to https://github.com/ma3a/SDH-PlayTime

import { ServerAPI } from "decky-frontend-lib";
import logger from "../utils";
import { toIsoDateOnly } from "./formatters";
import { DailyStatistics, Game, GameWithTime } from "./model";
import { EventBus } from "./system";

export interface OverallPlayTimes {
  [gameId: string]: number;
}

export interface StatisticForIntervalResponse {
  data: DailyStatistics[];
  hasPrev: boolean;
  hasNext: boolean;
}

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
            name: "Steam",
          });
          break;

        case "GameWasRunningBefore":
          await instance.changeGame(event.game);
          break;

        case "ResumeFromSuspend":
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
          game: Game;
        },
        void
      >("set_game", {
        game: game,
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

  // private async addTime(startedAt: number, endedAt: number, game: Game) {
  //   await this.serverApi
  //     .callPluginMethod<
  //       {
  //         started_at: number;
  //         ended_at: number;
  //         game_id: string;
  //         game_name: string;
  //       },
  //       void
  //     >("add_time", {
  //       started_at: startedAt / 1000,
  //       ended_at: endedAt / 1000,
  //       game_id: game.id,
  //       game_name: game.name,
  //     })
  //     .then((r) => {
  //       if (!r.success) {
  //         this.errorOnBackend(
  //           "Can't save interval, because of backend error (add_time)"
  //         );
  //       }
  //     })
  //     .catch((_) => {
  //       this.errorOnBackend(
  //         "Can't save interval, because of backend error (add_time)"
  //       );
  //     });
  // }

  // async fetchDailyStatisticForInterval(
  //   start: Date,
  //   end: Date
  // ): Promise<StatisticForIntervalResponse> {
  //   const response = await this.serverApi.callPluginMethod<
  //     { start_date: string; end_date: string },
  //     StatisticForIntervalResponse
  //   >("daily_statistics_for_period", {
  //     start_date: toIsoDateOnly(start),
  //     end_date: toIsoDateOnly(end),
  //   });
  //   if (!response.success) {
  //     this.errorOnBackend(
  //       "Can't fetch statistics for interval, because of backend error (daily_statistics_for_period)"
  //     );
  //     return {
  //       hasNext: false,
  //       hasPrev: false,
  //       data: [],
  //     } as StatisticForIntervalResponse;
  //   }

  //   return response.result as StatisticForIntervalResponse;
  // }

  // async fetchPerGameOverallStatistics(): Promise<GameWithTime[]> {
  //   const response = await this.serverApi.callPluginMethod<{}, GameWithTime[]>(
  //     "per_game_overall_statistics",
  //     {}
  //   );
  //   if (!response.success) {
  //     this.errorOnBackend(
  //       "Can't fetch per game overall statistics, because of backend error (per_game_overall_statistics)"
  //     );
  //     return [];
  //   }

  //   return response.result as GameWithTime[];
  // }

  // async applyManualOverallTimeCorrection(
  //   games: GameWithTime[]
  // ): Promise<boolean> {
  //   const response = await this.serverApi.callPluginMethod<
  //     {
  //       list_of_game_stats: GameWithTime[];
  //     },
  //     void
  //   >("apply_manual_time_correction", {
  //     list_of_game_stats: games,
  //   });
  //   if (!response.success) {
  //     this.errorOnBackend(
  //       "Can't apply manual overall time correction, because of backend error (apply_manual_time_correction)"
  //     );
  //     return false;
  //   }
  //   this.eventBus.emit({ type: "TimeManuallyAdjusted" });
  //   return true;
  // }

  private errorOnBackend(message: string) {
    logger.error(`There is an error: ${message}`);
    this.eventBus.emit({
      type: "NotifyAboutError",
      message: message,
    });
  }
}
