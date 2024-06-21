# credits to https://github.com/ma3a/SDH-PlayTime


import datetime
import logging
from typing import List
from python.db.dao import Dao


DATE_FORMAT = "%Y-%m-%d"
logger = logging.getLogger()


class UsageTracking:
    dao: Dao

    def __init__(self, dao: Dao) -> None:
        self.dao = dao

    def add_time(
        self,
        date_time: int,
        capacity: int,
        status: int,
        power: int,
        game_id: str,
        game_name: str,
    ):
        self.dao.save_game_dict(game_id, game_name)

        self.dao.save_battery_usage(
            datetime.datetime.fromtimestamp(date_time),
            capacity,
            status,
            power,
            game_id,
        )

    def get_average_from_multiple_samples(self, running_list: List[tuple]) -> tuple:
        if not running_list:
            return ()

        date_times, capacities, statuses, powers, game_ids, game_names = zip(
            *running_list
        )

        count_minus_one = statuses.count(-1)
        count_zero = statuses.count(0)
        count_one = statuses.count(1)

        if count_one > count_minus_one and count_one > count_zero:
            average_status = 1
        elif count_minus_one > count_one and count_minus_one > count_zero:
            average_status = -1
        else:
            avg_capacity = int(sum(capacities) / len(capacities))
            if avg_capacity > capacities[0]:
                average_status = 1
            elif avg_capacity < capacities[0]:
                average_status = -1
            else:
                average_status = 0

        avg_power = int(sum(powers) / len(powers))

        average_game_id = max(set(game_ids), key=game_ids.count)
        average_game_name = max(set(game_names), key=game_names.count)

        latest_index = date_times.index(max(date_times))
        latest_datetime = date_times[latest_index]
        latest_capacity = capacities[latest_index]

        single_sample = (
            latest_datetime,
            latest_capacity,
            average_status,
            avg_power,
            average_game_id,
            average_game_name,
        )

        return single_sample
