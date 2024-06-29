# credits to https://github.com/ma3a/SDH-PlayTime

import time
import asyncio
import logging
import os
import sys
from pathlib import Path


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
    format="[BatteryUsage] %(asctime)s %(levelname)s %(message)s",
    filemode="w+",
    force=True,
)
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def add_plugin_to_path():
    directories = [["./"], ["python"]]
    for import_dir in directories:
        sys.path.append(str(plugin_dir.joinpath(*import_dir)))


add_plugin_to_path()


from python.db.sqlite_db import SqlLiteDb
from python.db.dao import Dao
from python.db.migration import DbMigration
from python.usage_tracking import UsageTracking


class Plugin:
    usage_tracking = None
    statistics = None
    game_id = None
    game_name = None

    async def _main(self):
        try:
            self.game_id = "Unknown"
            self.game_name = "Steam"
            db = SqlLiteDb(f"{data_dir}/battery-usage.db")
            migration = DbMigration(db)
            migration.migrate()

            dao = Dao(db)
            self.usage_tracking = UsageTracking(dao)
            loop = asyncio.get_event_loop()
            self._recorder_task = loop.create_task(Plugin.recorder(self))
        except Exception as e:
            logger.exception(f"Unhandled exception: {e}")

    async def set_game(self, game_id: str, game_name: str):
        logger.info(f"Setting Game as {game_id} and {game_name}")
        if self.game_id:
            self.game_id = game_id
            self.game_name = game_name
        return True

    async def hourly_statistics(self):
        try:
            return await self.statistics.hourly_battery_usage_statistics()
        except Exception as e:
            logger.exception(f"Unhandled exception: {e}")

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

                running_list.append(
                    (
                        curr_time,
                        cap,
                        stat,
                        power,
                        self.game_id,
                        self.game_name,
                    )
                )

                if len(running_list) > 4:
                    average_sample = (
                        self.usage_tracking.get_average_from_multiple_samples(
                            running_list
                        )
                    )

                    self.usage_tracking.add_time(*average_sample)

                    logger.info("Recorder added avg sample to DB")

                    running_list = []
            except Exception as e:
                logger.exception(f"Unhandled exception: {e}")

            await asyncio.sleep(12)
