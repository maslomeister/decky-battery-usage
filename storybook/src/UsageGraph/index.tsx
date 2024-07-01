import { useLayoutEffect, useRef, useState } from "react";
import { usage_graph } from "./styles";
import { MainGraph } from "./mainGraph";
import { DailyGraph, GraphV2 } from "./DailyGraph";

export const debugBorderEnabled = false;

export type UsageGraphProps = {
  title?: string;
  body?: string;
};

const data = [
  {
    hour: 12,
    capacity: 20,
    charging: 0,
  },
  {
    hour: 13,
    capacity: 20,
    charging: 0,
  },
  {
    hour: 14,
    capacity: 25,
    charging: 0,
  },
  {
    hour: 15,
    capacity: 26,
    charging: 100,
  },
  {
    hour: 16,
    capacity: 30,
    charging: 100,
  },
  {
    hour: 17,
    capacity: 32,
    charging: 100,
  },
  {
    hour: 18,
    capacity: 34,
    charging: 100,
  },
  {
    hour: 19,
    capacity: 38,
    charging: 100,
  },
  {
    hour: 20,
    capacity: 40,
    charging: 100,
  },
  {
    hour: 21,
    capacity: 45,
    charging: 100,
  },
  {
    hour: 22,
    capacity: 50,
    charging: 100,
  },
  {
    hour: 23,
    capacity: 55,
    charging: 100,
  },

  {
    hour: 0,
    capacity: 60,
    charging: 100,
  },
  {
    hour: 1,
    capacity: 65,
    charging: 100,
  },
  {
    hour: 2,
    capacity: 70,
    charging: 100,
  },
  {
    hour: 3,
    capacity: 75,
    charging: 100,
  },
  {
    hour: 4,
    capacity: 80,
    charging: 100,
  },
  {
    hour: 5,
    capacity: 85,
    charging: 100,
  },
  {
    hour: 6,
    capacity: 86,
    charging: 100,
  },
  {
    hour: 7,
    capacity: 88,
    charging: 100,
  },
  {
    hour: 8,
    capacity: 88,
    charging: 100,
  },
  {
    hour: 9,
    capacity: 90,
    charging: 100,
  },
];

const small_data = [
  {
    hour: 8,
    capacity: 88,
    charging: 0,
  },
  {
    hour: 9,
    capacity: 90,
    charging: 100,
  },
  {
    hour: 10,
    capacity: 88,
    charging: 100,
  },
  {
    hour: 11,
    capacity: 85,
    charging: 0,
  },
];

export const UsageGraph = (props: UsageGraphProps) => {
  const targetRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        ...usage_graph,
        height: "200px",
        border: debugBorderEnabled ? "red solid 2px" : undefined,
        borderRadius: "16px",
      }}
      ref={targetRef}
    >
      <DailyGraph data={data} />
    </div>
  );
};
