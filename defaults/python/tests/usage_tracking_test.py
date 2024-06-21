import time
from python.usage_tracking import UsageTracking
from python.tests.helpers import AbstractDatabaseTest
from python.db.migration import DbMigration
from python.db.dao import Dao
import unittest


class TestUsageTracking(AbstractDatabaseTest):
    usage_tracking: UsageTracking

    def setUp(self) -> None:
        super().setUp()
        DbMigration(db=self.database).migrate()
        self.usage_tracking = UsageTracking(Dao(self.database))

    def test_should_return_average_from_charging_samples(self):
        base_time = time.time()
        sample_data_charge = [
            (base_time, 81, 1, 220, "236870", "Hitman"),
            (base_time + 10, 81, 1, 200, "236870", "Hitman"),
            (base_time + 20, 82, 1, 180, "236870", "Hitman"),
            (base_time + 30, 82, 1, 180, "236870", "Hitman"),
            (base_time + 40, 83, 1, 190, "236870", "Hitman"),
        ]
        expected_result = (
            base_time + 40,
            83,
            1,
            194,
            "236870",
            "Hitman",
        )
        result = self.usage_tracking.get_average_from_multiple_samples(
            sample_data_charge
        )
        self.assertEqual(result, expected_result)

    def test_should_return_average_from_discharging_samples(self):
        base_time = time.time()
        sample_data_discharge = [
            (base_time, 81, 0, 220, "236870", "Hitman"),
            (base_time + 10, 80, -1, 200, "236870", "Hitman"),
            (base_time + 20, 80, -1, 180, "236870", "Hitman"),
            (base_time + 30, 79, -1, 180, "236870", "Hitman"),
            (base_time + 40, 78, -1, 190, "236870", "Hitman"),
        ]
        expected_result = (
            base_time + 40,
            78,
            -1,
            194,
            "236870",
            "Hitman",
        )
        result = self.usage_tracking.get_average_from_multiple_samples(
            sample_data_discharge
        )
        self.assertEqual(result, expected_result)

    def test_should_return_average_from_chaotic_samples(self):
        base_time = time.time()
        sample_data_chaotic = [
            (base_time, 81, 0, 79, "Unknown", "Steam"),
            (base_time + 10, 81, -1, 140, "236870", "Hitamn"),
            (base_time + 20, 80, -1, 240, "236870", "Hitman"),
            (base_time + 30, 81, 1, 80, "Unknown", "Steam"),
            (base_time + 40, 80, -1, 75, "Unknown", "Steam"),
        ]
        expected_result = (
            base_time + 40,
            80,
            -1,
            122,
            "Unknown",
            "Steam",
        )

        result = self.usage_tracking.get_average_from_multiple_samples(
            sample_data_chaotic
        )
        self.assertEqual(result, expected_result)

    def test_should_return_average_from_indecisive_samples(self):
        base_time = time.time()
        sample_data_chaotic = [
            (base_time, 81, 0, 79, "Unknown", "Steam"),
            (base_time + 10, 79, 0, 140, "236870", "Hitman"),
            (base_time + 20, 79, 1, 240, "236870", "Hitman"),
            (base_time + 30, 78, 1, 80, "Unknown", "Steam"),
            (base_time + 40, 78, -1, 75, "Unknown", "Steam"),
        ]
        expected_result = (
            base_time + 40,
            78,
            -1,
            122,
            "Unknown",
            "Steam",
        )

        result = self.usage_tracking.get_average_from_multiple_samples(
            sample_data_chaotic
        )
        self.assertEqual(result, expected_result)


if __name__ == "__main__":
    unittest.main()
