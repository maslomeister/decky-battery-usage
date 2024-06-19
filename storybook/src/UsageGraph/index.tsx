import { useLayoutEffect, useRef, useState } from "react";
import { usage_graph } from "./styles";
import { BottomGraphPadding } from "./BottomGraphPadding";
import { MainGraph } from "./mainGraph";
import { RightGraphPadding } from "./rightGraphPadding";

export const debugBorderEnabled = false;

export type UsageGraphProps = {
  title?: string;
  body?: string;
};

export const UsageGraph = (props: UsageGraphProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetWidth / (16 / 10),
      });
    }
  }, []);

  return (
    <div
      style={{
        ...usage_graph,
        height: dimensions.height,
        border: debugBorderEnabled ? "red solid 2px" : undefined,
        paddingTop: "24px",
        paddingLeft: "8px",
        background: "#1c1c1e",
        borderRadius: "16px",
      }}
      ref={targetRef}
    >
      <MainGraph parentDimensions={dimensions} />
    </div>
  );
};
