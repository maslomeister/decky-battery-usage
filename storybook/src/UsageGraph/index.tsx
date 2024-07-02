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
  { hour: "09", capacity: 93, charging: 100 },
  { hour: "10", capacity: 97, charging: 100 },
  { hour: "11", capacity: 100, charging: 100 },
  { hour: "12", capacity: 99, charging: 0 },
  { hour: "13", capacity: 99, charging: 0 },
  { hour: "14", capacity: 99, charging: 0 },
  { hour: "15", capacity: 99, charging: 0 },
  { hour: "16", capacity: 99, charging: 0 },
  { hour: "17", capacity: 99, charging: 0 },
  { hour: "18", capacity: 99, charging: 0 },
  { hour: "19", capacity: 96, charging: 0 },
  { hour: "20", capacity: 92, charging: 0 },
  { hour: "21", capacity: 89, charging: 0 },
  { hour: "22", capacity: 85, charging: 0 },
  { hour: "23", capacity: 82, charging: 0 },
  { hour: "00", capacity: 78, charging: 0 },
  { hour: "01", capacity: 75, charging: 0 },
  { hour: "02", capacity: 71, charging: 0 },
  { hour: "03", capacity: 68, charging: 0 },
  { hour: "04", capacity: 39, charging: 0 },
  { hour: "05", capacity: 30, charging: 100 },
  { hour: "06", capacity: 61, charging: 100 },
  { hour: "07", capacity: 90, charging: 100 },
  { hour: "08", capacity: 98, charging: 100 },
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
