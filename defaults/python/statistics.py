from dataclasses import dataclass
from datetime import datetime, timedelta
from python.db.dao import Dao
from typing import List
from collections import defaultdict


def insert_element(data, index, element):
    data.insert(index, element)


@dataclass
class UsageItem:
    hour: str
    capacity: int


class Statistics:
    dao: Dao
    stored_statistics: List[UsageItem]

    def __init__(self, dao: Dao) -> None:
        self.dao = dao
        self.stored_statistics = []

    async def hourly_battery_usage_statistics(self) -> List[UsageItem]:
        if self.stored_statistics:
            current_hour = datetime.now().strftime("%H")
            last_item_hour = self.stored_statistics[-1]["hour"]
            if current_hour == last_item_hour:
                print("returned last hour")
                return self.stored_statistics

        # Calculate the current date
        current_date = datetime.now().date()

        # Calculate the start date as one day before the current date
        start_date = current_date - timedelta(days=1)

        data = self.dao.fetch_per_hour_battery_usage_report(start_date, current_date)

        data_by_hour = defaultdict(list)
        for entry in data:
            dt = datetime.strptime(entry.date_time, "%Y-%m-%d %H")
            hour = dt.hour  # Extract only the hour part as an integer
            data_by_hour[hour].append(entry)
        aggregated_data = []
        for hour, entries in data_by_hour.items():
            last_entry = max(entries, key=lambda x: x.date_time)
            aggregated_data.append({"hour": hour, "capacity": last_entry.capacity})
        i = 0
        while i < len(aggregated_data) - 1:
            current_hour = aggregated_data[i]["hour"]
            next_hour = aggregated_data[i + 1]["hour"]
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
                    new_capacity = round(
                        aggregated_data[i]["capacity"] + j * capacity_diff
                    )
                    insert_element(
                        aggregated_data,
                        i + j,
                        {"hour": new_hour, "capacity": new_capacity},
                    )
                # Move the index forward to account for the newly inserted elements
                i += diff_hours
            i += 1
        for item in aggregated_data:
            item["hour"] = f"{item['hour']:02d}"

        self.stored_statistics = aggregated_data

        return self.stored_statistics
