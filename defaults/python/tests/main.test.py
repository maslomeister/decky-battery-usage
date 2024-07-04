# credits to https://github.com/ma3a/SDH-PlayTime

from collections import defaultdict
from datetime import datetime, timedelta
import time
import asyncio
import logging
import os
import sys
from pathlib import Path
import traceback

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

cwd = os.getcwd()

from python.statistics import Statistics
from python.db.sqlite_db import SqlLiteDb
from python.db.dao import Dao
from python.usage_tracking import UsageTracking

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))


cwd = os.getcwd()

print(cwd)


def insert_element(data, index, element):
    data.insert(index, element)


def format_exception(e):
    exception_list = traceback.format_stack()
    exception_list = exception_list[:-2]
    exception_list.extend(traceback.format_tb(sys.exc_info()[2]))
    exception_list.extend(
        traceback.format_exception_only(sys.exc_info()[0], sys.exc_info()[1])
    )

    exception_str = "Traceback (most recent call last):\n"
    exception_str += "".join(exception_list)
    # Removing the last \n
    exception_str = exception_str[:-1]

    return exception_str


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

            for game in result["games_stats"]["games"]:
                print(f"{game['game_name']} - {game['percentage']}% - {game["hours"]}")

            print(
                f"SUSPENDED - {result["games_stats"]["suspended"]["percentage"]}% - {result["games_stats"]["suspended"]["hours"]}"
            )

            total_percentage = (
                sum(game["percentage"] for game in result["games_stats"]["games"])
                + result["games_stats"]["suspended"]["percentage"]
            )

            print(f"TOTAL - {total_percentage}")

            return result
        except Exception as e:
            print("Printing only the traceback above the current stack frame")
            print(
                "".join(
                    traceback.format_exception(
                        sys.exc_info()[0], sys.exc_info()[1], sys.exc_info()[2]
                    )
                )
            )
            print("")
            print("Printing the full traceback as if we had not caught it here...")
            print(format_exception(e))


if __name__ == "__main__":
    plugin = Plugin()
    asyncio.run(plugin._main())
    asyncio.run(plugin.hourly_statistics())
