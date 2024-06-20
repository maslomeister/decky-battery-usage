# credits to https://github.com/ma3a/SDH-PlayTime

import datetime
import logging
from typing import Dict, List
from python.db.dao import Dao


DATE_FORMAT = "%Y-%m-%d"
logger = logging.getLogger()


class UsageTracking:
    dao: Dao

    def __init__(self, dao: Dao) -> None:
        self.dao = dao

    def add_time(self,
                 date_time: int,
                 capacity: int,
                 status: int,
                 power: int,
                 game_id: str,
                 game_name: str):

        self.dao.save_game_dict(game_id, game_name)
        self.dao.save_battery_usage(
            datetime.datetime.fromtimestamp(date_time), capacity, status, power, game_id, game_name)

        # intervals = []
        # if (started_at < day_end_for_start_at
        #         and ended_at > day_end_for_start_at):
        #     intervals.append(
        #         (started_at, day_end_for_start_at + 1, game_id, game_name))
        #     intervals.append(
        #         (day_end_for_start_at + 1, ended_at, game_id, game_name))
        # else:
        #     intervals.append(
        #         (started_at, ended_at, game_id, game_name))

        # for interval in intervals:
        #     (i_started_at, i_ended_at, i_game_id, _) = interval
        #     length = i_ended_at - i_started_at
        #     self.dao.save_play_time(datetime.fromtimestamp(
        #         i_started_at), length, i_game_id)

    # def apply_manual_time_for_games(self,
    #                                 list_of_game_stats: List[Dict],
    #                                 source: str):
    #     now = datetime.now()
    #     for stat in list_of_game_stats:
    #         self.dao.apply_manual_time_for_game(
    #             now,
    #             stat["game"]["id"],
    #             stat["game"]["name"],
    #             stat["time"],
    #             source
    #         )
