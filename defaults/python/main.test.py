# credits to https://github.com/ma3a/SDH-PlayTime

from collections import defaultdict
from datetime import datetime, timedelta
import time
import asyncio
import logging
import os
import sys
from pathlib import Path

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from python.statistics import Statistics
from python.db.sqlite_db import SqlLiteDb
from python.db.dao import Dao
from python.db.migration import DbMigration
from python.usage_tracking import UsageTracking

cwd = os.getcwd()


def insert_element(data, index, element):
    data.insert(index, element)


class Plugin:
    usage_tracking = None
    statistics = None
    game_id = None
    game_name = None

    async def _main(self):
        try:
            self.game_id = "Unknown"
            self.game_name = "Steam"
            db = SqlLiteDb(f"{cwd}/battery-usage.db")
            # migration = DbMigration(db)
            # migration.migrate()

            dao = Dao(db)
            self.statistics = Statistics(dao)

            self.usage_tracking = UsageTracking(dao)

        except Exception as e:
            print(f"Error: {e}")

    async def hourly_statistics(self):
        try:
            result = await self.statistics.hourly_battery_usage_statistics()

            for game in result["game_percentage"]["games"]:
                print(f"{game['game_name']} - {game['percentage']}% - {game["hours"]}")

            print(
                f"SUSPENDED - {result["game_percentage"]["suspended"]["percentage"]}%"
            )

            total_percentage = (
                sum(game["percentage"] for game in result["game_percentage"]["games"])
                + result["game_percentage"]["suspended"]["percentage"]
            )

            print(f"TOTAL - {total_percentage}")

            return result
        except Exception as e:
            print(f"Error: {e}")


if __name__ == "__main__":
    plugin = Plugin()
    asyncio.run(plugin._main())
    asyncio.run(plugin.hourly_statistics())
