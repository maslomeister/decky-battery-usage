import { DailyGraph } from "../components/graphs/DailyGraph";

const data = [
  {
    hour: 12,
    charge: 20,
  },
  {
    hour: 13,
    charge: 20,
  },
  {
    hour: 14,
    charge: 25,
  },
  {
    hour: 15,
    charge: 26,
  },
  {
    hour: 16,
    charge: 30,
  },
  {
    hour: 17,
    charge: 32,
  },
  {
    hour: 18,
    charge: 34,
  },
  {
    hour: 19,
    charge: 38,
  },
  {
    hour: 20,
    charge: 40,
  },
  {
    hour: 21,
    charge: 45,
  },
  {
    hour: 22,
    charge: 50,
  },
  {
    hour: 23,
    charge: 55,
  },

  {
    hour: 0,
    charge: 60,
  },
  {
    hour: 1,
    charge: 65,
  },
  {
    hour: 2,
    charge: 70,
  },
  {
    hour: 3,
    charge: 75,
  },
  {
    hour: 4,
    charge: 80,
  },
  {
    hour: 5,
    charge: 85,
  },
  {
    hour: 6,
    charge: 86,
  },
  {
    hour: 7,
    charge: 88,
  },
  {
    hour: 8,
    charge: 88,
  },
  {
    hour: 9,
    charge: 90,
  },
];

const smallData = [
  {
    hour: 15,
    charge: 95,
  },
  {
    hour: 16,
    charge: 90,
  },
];

export const DailyUsageGraph = () => {
  return (
    <div>
      <DailyGraph data={data} />
    </div>
  );
};
