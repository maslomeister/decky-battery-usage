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
    charge: 20,
    charging: 0,
  },
  {
    hour: 13,
    charge: 20,
    charging: 0,
  },
  {
    hour: 14,
    charge: 25,
    charging: 0,
  },
  {
    hour: 15,
    charge: 26,
    charging: 100,
  },
  {
    hour: 16,
    charge: 30,
    charging: 100,
  },
  {
    hour: 17,
    charge: 32,
    charging: 100,
  },
  {
    hour: 18,
    charge: 34,
    charging: 100,
  },
  {
    hour: 19,
    charge: 38,
    charging: 100,
  },
  {
    hour: 20,
    charge: 40,
    charging: 100,
  },
  {
    hour: 21,
    charge: 45,
    charging: 100,
  },
  {
    hour: 22,
    charge: 50,
    charging: 100,
  },
  {
    hour: 23,
    charge: 55,
    charging: 100,
  },

  {
    hour: 0,
    charge: 60,
    charging: 100,
  },
  {
    hour: 1,
    charge: 65,
    charging: 100,
  },
  {
    hour: 2,
    charge: 70,
    charging: 100,
  },
  {
    hour: 3,
    charge: 75,
    charging: 100,
  },
  {
    hour: 4,
    charge: 80,
    charging: 100,
  },
  {
    hour: 5,
    charge: 85,
    charging: 100,
  },
  {
    hour: 6,
    charge: 86,
    charging: 100,
  },
  {
    hour: 7,
    charge: 88,
    charging: 100,
  },
  {
    hour: 8,
    charge: 88,
    charging: 100,
  },
  {
    hour: 9,
    charge: 90,
    charging: 100,
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
      <DailyGraph data={[]} />
    </div>
  );
};
