from dataclasses import dataclass
from datetime import datetime, timedelta
from math import floor
from python.db.dao import Dao
from typing import List
from collections import defaultdict

from python.helpers import (
    insert_element,
)


@dataclass
class UsageItem:
    hour: str
    capacity: int


@dataclass
class GameItem:
    game_name: str
    percentage: int
    watts: float


@dataclass
class Suspended:
    percentage: int
    watts: float


@dataclass
class GamesStats:
    games: List[GameItem]
    suspended: Suspended


class Statistics:
    dao: Dao
    stored_statistics: List[UsageItem]
    games_stats: GamesStats

    def __init__(self, dao: Dao) -> None:
        self.dao = dao
        self.stored_statistics = []
        self.games_stats = []

    async def hourly_battery_usage_statistics(self):
        if self.stored_statistics:
            # current_hour = datetime.now().strftime("%H")
            current_hour = datetime.now().strftime("%H")
            last_item_hour = self.stored_statistics[-1]["hour"]
            if current_hour == last_item_hour:
                return {
                    "battery_usage": self.stored_statistics,
                    "games_stats": self.games_stats,
                }

        # Calculate the current date
        # yesterday_date = datetime.now() - timedelta(hours=23)
        yesterday_date = datetime.now() - timedelta(hours=23)

        data = self.dao.fetch_per_hour_battery_usage_report(yesterday_date)

        if len(data) <= 2:
            self.stored_statistics = []
            self.games_stats = {"games": [], "suspended": {"percentage": 0, "hours": 0}}
            return {
                "battery_usage": self.stored_statistics,
                "games_stats": self.games_stats,
            }

        data_by_hour = defaultdict(list)
        games_pecentages = {}

        for i, entry in enumerate(data):
            dt = datetime.strptime(entry.date_time, "%Y-%m-%d %H %M")
            hour = dt.hour  # Extract only the hour part as an integer
            if entry.status == -1:
                if entry.game_name in games_pecentages:
                    if (
                        games_pecentages[entry.game_name]["last_charge"]
                        < entry.capacity
                        or i - games_pecentages[entry.game_name]["last_pos"] > 2
                    ):
                        games_pecentages[entry.game_name]["last_charge"] = (
                            entry.capacity
                        )
                        games_pecentages[entry.game_name]["last_pos"] = i
                    else:
                        total_charge = (
                            games_pecentages[entry.game_name]["last_charge"]
                            - entry.capacity
                        )
                        games_pecentages[entry.game_name]["total_charge"] += (
                            total_charge
                        )
                        games_pecentages[entry.game_name]["last_charge"] = (
                            entry.capacity
                        )
                        games_pecentages[entry.game_name]["last_pos"] = i

                        games_pecentages[entry.game_name]["amount"] += 1

                        games_pecentages[entry.game_name]["total_power"] += entry.power
                else:
                    games_pecentages[entry.game_name] = {
                        "last_charge": entry.capacity,
                        "total_charge": 0,
                        "last_pos": i,
                        "amount": 0,
                        "total_power": 0,
                    }

            data_by_hour[hour].append(entry)

        aggregated_data = []
        print(games_pecentages)

        for hour, entries in data_by_hour.items():
            last_entry = min(entries, key=lambda x: x.capacity)
            aggregated_data.append(
                {
                    "hour": hour,
                    "capacity": last_entry.capacity,
                    "charging": 0,
                }
            )
        i = 0

        while i < len(aggregated_data) - 1:
            current_hour = aggregated_data[i]["hour"]
            next_hour = aggregated_data[i + 1]["hour"]

            if next_hour <= current_hour:
                next_hour += 24

            # Check if the next element's hour is exactly 1 hour away
            if next_hour != current_hour + 1:
                # Calculate the difference in hours
                diff_hours = next_hour - current_hour - 1

                # Calculate the capacity step
                capacity_diff = (
                    aggregated_data[i + 1]["capacity"] - aggregated_data[i]["capacity"]
                ) / (diff_hours + 1)
                # Insert missing hours with interpolated capacities
                for j in range(1, diff_hours + 1):
                    new_hour = current_hour + j
                    if new_hour >= 24:
                        new_hour -= 24
                    new_capacity = round(
                        aggregated_data[i]["capacity"] + j * capacity_diff
                    )
                    insert_element(
                        aggregated_data,
                        i + j,
                        {"hour": new_hour, "capacity": new_capacity, "charging": 0},
                    )
                # Move the index forward to account for the newly inserted elements
                i += diff_hours
            i += 1

        for item in aggregated_data:
            item["hour"] = f"{item['hour']:02d}"

        if len(aggregated_data) > 2:
            for i in range(
                len(aggregated_data) - 1
            ):  # Exclude the last item in the range
                if (
                    aggregated_data[i]["capacity"] > aggregated_data[i - 1]["capacity"]
                    or aggregated_data[i]["capacity"]
                    < aggregated_data[i + 1]["capacity"]
                ):
                    aggregated_data[i]["charging"] = 100

            if aggregated_data[0]["capacity"] < aggregated_data[1]["capacity"]:
                aggregated_data[-0]["charging"] = 100

            if aggregated_data[-2]["capacity"] < aggregated_data[-1]["capacity"]:
                aggregated_data[-1]["charging"] = 100

        games_list = []
        for item in games_pecentages:
            if games_pecentages[item]["total_charge"] > 0:
                watts = (games_pecentages[item]["total_power"] / 10) / games_pecentages[
                    item
                ]["amount"]

                games_list.append(
                    {
                        "game_name": item,
                        "percentage": games_pecentages[item]["total_charge"],
                        "watts": floor(watts * 10) / 10,
                    }
                )
        self.games_stats = {
            "games": games_list,
        }

        self.stored_statistics = aggregated_data

        return {
            "battery_usage": self.stored_statistics,
            "games_stats": self.games_stats,
        }
