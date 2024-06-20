import { useLayoutEffect, useRef, useState } from "react";
import { usage_graph } from "./styles";
import { MainGraph } from "./mainGraph";
import { GraphV2 } from "./graphV2";

export const debugBorderEnabled = false;

export type UsageGraphProps = {
  title?: string;
  body?: string;
};

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
      {/* <MainGraph parentDimensions={dimensions} /> */}
      <GraphV2 />
    </div>
  );
};
