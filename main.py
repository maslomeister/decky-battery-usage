# credits to https://github.com/ma3a/SDH-PlayTime

# autopep8: off
import time
import dataclasses
import asyncio
import logging
import os
import sys
from pathlib import Path
from typing import Any, List


decky_home = os.environ["DECKY_HOME"]
log_dir = os.environ["DECKY_PLUGIN_LOG_DIR"]
data_dir = os.environ["DECKY_PLUGIN_RUNTIME_DIR"]
plugin_dir = Path(os.environ["DECKY_PLUGIN_DIR"])

battery_volt_dir = "/sys/class/power_supply/BAT1/voltage_now"
battery_curr_dir = "/sys/class/power_supply/BAT1/current_now"
battery_capacity_dir = "/sys/class/power_supply/BAT1/capacity"
battery_status_dir = "/sys/class/power_supply/BAT1/status"

logging.basicConfig(
    filename=f"{log_dir}/battery-usage.log",
    format='[BatteryUsage] %(asctime)s %(levelname)s %(message)s',
    filemode='w+',
    force=True
)
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def add_plugin_to_path():
    directories = [["./"], ["python"]]
    for import_dir in directories:
        sys.path.append(str(plugin_dir.joinpath(*import_dir)))


add_plugin_to_path()
# pylint: disable=wrong-import-position
from python.db.sqlite_db import SqlLiteDb
from python.db.dao import Dao
from python.db.migration import DbMigration
# from python.statistics import Statistics
from python.usage_tracking import UsageTracking
from python.helpers import parse_date
# pylint: enable=wrong-import-position

# autopep8: on


class Plugin:
    usage_tracking = None
    statistics = None
    game_id = "Unknown"

    async def _main(self):
        try:
            db = SqlLiteDb(f"{data_dir}/battery-usage.db")
            migration = DbMigration(db)
            migration.migrate()

            dao = Dao(db)
            self.usage_tracking = UsageTracking(dao)
            loop = asyncio.get_event_loop()
            self._recorder_task = loop.create_task(Plugin.recorder(self))
            # self.statistics = Statistics(dao)
        except Exception:
            logger.exception("Unhandled exception")

    # async def add_usage(self,
    #                     started_at: int,
    #                     ended_at: int,
    #                     game_id: str,
    #                     game_name: str):
    #     try:
    #         self.time_tracking.add_time(
    #             started_at=started_at,
    #             ended_at=ended_at,
    #             game_id=game_id,
    #             game_name=game_name
    #         )
    #     except Exception:
    #         logger.exception("Unhandled exception")

    # async def daily_statistics_for_period(self, start_date: str, end_date: str):
    #     try:
    #         return dataclasses.asdict(
    #             self.statistics.daily_statistics_for_period(
    #                 parse_date(start_date),
    #                 parse_date(end_date))
    #         )
    #     except Exception:
    #         logger.exception("Unhandled exception")

    # async def per_game_overall_statistics(self):
    #     try:
    #         return self.statistics.per_game_overall_statistic()
    #     except Exception:
    #         logger.exception("Unhandled exception")

    # async def apply_manual_time_correction(
    #         self, list_of_game_stats: List[dict[str, Any]]):
    #     try:
    #         return self.time_tracking.apply_manual_time_for_games(
    #             list_of_game_stats=list_of_game_stats,
    #             source="manually-changed")
    #     except Exception:
    #         logger.exception("Unhandled exception")

    async def set_game_id(self, game_id: str = "Unknown"):
        logger.info(f"Setting app_id as {game_id}")
        if game_id:
            self.game_id = game_id
        return True

    async def recorder(self):
        volt_file = open(battery_volt_dir)
        curr_file = open(battery_curr_dir)
        cap_file = open(battery_capacity_dir)
        status = open(battery_status_dir)

        logger.info("Battery usage recorder started")
        running_list = []
        while True:
            try:
                volt_file.seek(0)
                curr_file.seek(0)
                cap_file.seek(0)
                status.seek(0)

                volt = int(volt_file.read().strip())
                curr = int(curr_file.read().strip())
                cap = int(cap_file.read().strip())
                stat = status.read().strip()

                if stat == "Discharging":
                    stat = -1
                elif stat == "Charging":
                    stat = 1
                else:
                    stat = 0

                power = int(volt * curr * 10.0**-11)

                curr_time = time.time()

                self.usage_tracking.add_time(
                    date_time=curr_time,
                    capacity=cap,
                    status=stat,
                    power=power,
                    game_id=self.game_id,
                    game_name=""
                )

                # running_list.append(
                #     (curr_time, cap, stat, power, self.game_id))
                # if len(running_list) > 12:
                #     self.cursor.executemany(
                #         "insert into battery values (?, ?, ?, ?, ?)", running_list
                #     )
                #     self.con.commit()
                #     running_list = []
            except Exception:
                logger.exception("recorder")

            await asyncio.sleep(5)
