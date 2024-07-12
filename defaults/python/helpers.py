from datetime import date, datetime, timedelta
from math import floor


DATE_FORMAT = "%Y-%m-%d"


def parse_date(date_str: str) -> date:
    return datetime.strptime(date_str, DATE_FORMAT).date()


def format_date(dt: datetime) -> str:
    return dt.strftime(DATE_FORMAT)


def end_of_day(day_to_end: datetime) -> datetime:
    return datetime.fromtimestamp(
        datetime.combine(
            day_to_end + timedelta(days=1), datetime.min.time()
        ).timestamp()
        - 1
    )


def insert_element(data, index, element):
    data.insert(index, element)


def calculate_adjusted_percentages(game_entry_percentage):
    # Calculate the total sum of the percentages
    total_percentage = sum(game_entry_percentage.values())

    # Compute exact percentages
    exact_percentages = {
        game: (percentage / total_percentage) * 100
        for game, percentage in game_entry_percentage.items()
    }

    # Round down each percentage and keep track of the fractional parts
    floored_percentages = {
        game: int(exact_percentage)
        for game, exact_percentage in exact_percentages.items()
    }
    fractional_parts = {
        game: exact_percentage - floored_percentages[game]
        for game, exact_percentage in exact_percentages.items()
    }

    # Calculate the remaining percentage to distribute
    remaining_percentage = 100 - sum(floored_percentages.values())

    # Distribute the remaining percentage points based on fractional parts
    sorted_fractional_parts = sorted(
        fractional_parts.items(), key=lambda x: x[1], reverse=True
    )

    for i in range(remaining_percentage):
        floored_percentages[sorted_fractional_parts[i][0]] += 1

    return floored_percentages


def minutes_to_hours_string(minutes):
    hours = minutes // 60
    minutes = minutes % 60
    if hours < 1:
        return f"~{minutes}M"

    if minutes == 0:
        return f"~{hours}H"

    return f"~{hours}H{minutes}M"
