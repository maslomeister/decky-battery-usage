from dataclasses import dataclass
from datetime import datetime, timedelta
from math import floor
from python.db.dao import Dao
from typing import List
from collections import defaultdict


def insert_element(data, index, element):
    data.insert(index, element)


@dataclass
class UsageItem:
    hour: str
    capacity: int


@dataclass
class PercentageItem:
    game_name: str
    percentage: int


@dataclass
class GameEntryPercentage:
    games: List[PercentageItem]
    suspended: int


class Statistics:
    dao: Dao
    stored_statistics: List[UsageItem]
    game_entry_percentage: GameEntryPercentage

    def __init__(self, dao: Dao) -> None:
        self.dao = dao
        self.stored_statistics = []
        self.game_entry_percentage = []

    async def hourly_battery_usage_statistics(self):
        if self.stored_statistics:
            current_hour = datetime.now().strftime("%H")
            last_item_hour = self.stored_statistics[-1]["hour"]
            if current_hour == last_item_hour:
                return {
                    "battery_usage": self.stored_statistics,
                    "game_percentage": self.game_entry_percentage,
                }

        # Calculate the current date
        yesterday_date = datetime.now() - timedelta(hours=23)

        data = self.dao.fetch_per_hour_battery_usage_report(yesterday_date)

        if len(data) == 0:
            self.stored_statistics = []
            self.game_entry_percentage = {"games": [], "suspended": 0}
            return {
                "battery_usage": self.stored_statistics,
                "game_percentage": self.game_entry_percentage,
            }

        data_by_hour = defaultdict(list)

        for entry in data:
            dt = datetime.strptime(entry.date_time, "%Y-%m-%d %H %M")
            hour = dt.hour  # Extract only the hour part as an integer
            data_by_hour[hour].append(entry)

        aggregated_data = []
        for hour, entries in data_by_hour.items():
            last_entry = min(entries, key=lambda x: x.capacity)
            aggregated_data.append(
                {"hour": hour, "capacity": last_entry.capacity, "charging": 0}
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

        for i in range(len(aggregated_data) - 1):  # Exclude the last item in the range
            if (
                aggregated_data[i]["capacity"] > aggregated_data[i - 1]["capacity"]
                or aggregated_data[i]["capacity"] < aggregated_data[i + 1]["capacity"]
            ):
                aggregated_data[i]["charging"] = 100

        if aggregated_data[0]["capacity"] < aggregated_data[1]["capacity"]:
            aggregated_data[-0]["charging"] = 100

        if aggregated_data[-2]["capacity"] < aggregated_data[-1]["capacity"]:
            aggregated_data[-1]["charging"] = 100

        game_entry_count = defaultdict(int)

        # Step 2: Convert date_time to datetime objects
        formatted_data = [
            (datetime.strptime(entry.date_time, "%Y-%m-%d %H %M"), entry.game_name)
            for entry in data
        ]

        filled_data = []

        start_time = min(dt for dt, _ in formatted_data)
        end_time = max(dt for dt, _ in formatted_data)

        current_time = start_time
        formatted_data_dict = dict(
            formatted_data
        )  # Convert list to dictionary for easy lookup

        while current_time <= end_time:
            if current_time in formatted_data_dict:
                filled_data.append(
                    {
                        "date_time": current_time.strftime("%Y-%m-%d %H %M"),
                        "game_name": formatted_data_dict[current_time],
                    }
                )
            else:
                filled_data.append(
                    {
                        "date_time": current_time.strftime("%Y-%m-%d %H %M"),
                        "game_name": "SUSPENDED",
                    }
                )
            current_time += timedelta(minutes=1)

        for entry in filled_data:
            game_entry_count[entry["game_name"]] += 1

        total_entries = len(filled_data)

        if total_entries > 0:
            game_entry_percentage = {
                game: (count / total_entries) * 100
                for game, count in game_entry_count.items()
            }

            total_percentage = sum(game_entry_percentage.values())
            rounding_error = 100 - total_percentage

            sorted_games = sorted(
                game_entry_percentage.items(), key=lambda x: x[1], reverse=True
            )

            if rounding_error != 0:
                # Determine how to distribute the rounding error
                adjustment_per_game = rounding_error / len(sorted_games)
                for i in range(len(sorted_games)):
                    game, _ = sorted_games[i]
                    game_entry_percentage[game] += adjustment_per_game

            game_entry_percentage_list = [
                {"game_name": game, "percentage": round(percentage)}
                for game, percentage in game_entry_percentage.items()
            ]

            suspended = next(
                (
                    item["percentage"]
                    for item in game_entry_percentage_list
                    if item["game_name"] == "SUSPENDED"
                ),
                0,
            )

            filtered_game_percentage = [
                item
                for item in game_entry_percentage_list
                if item["game_name"] != "SUSPENDED"
            ]

            sorted_game_percentage = sorted(
                filtered_game_percentage, key=lambda x: x["percentage"], reverse=True
            )

            self.game_entry_percentage = {
                "games": sorted_game_percentage,
                "suspended": suspended,
            }

        self.stored_statistics = aggregated_data

        return {
            "battery_usage": self.stored_statistics,
            "game_percentage": self.game_entry_percentage,
        }
