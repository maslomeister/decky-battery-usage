//  credits to https://github.com/ma3a/SDH-PlayTime

import { Game } from "./model";
import { Mountable } from "./system";

export type Events =
  | { type: "GameStarted"; createdAt: number; game: Game }
  | { type: "GameWasRunningBefore"; createdAt: number; game: Game }
  | { type: "GameStopped"; createdAt: number; game: Game }
  | { type: "ResumeFromSuspend"; createdAt: number; game: Game | null }
  | { type: "Suspended"; createdAt: number; game: Game | null }
  | { type: "Unmount"; createdAt: number; mounts: Mountable[] }
  | { type: "Mount"; createdAt: number; mounts: Mountable[] }
  | { type: "NotifyAboutError"; message: string }
  | { type: "TimeManuallyAdjusted" };
