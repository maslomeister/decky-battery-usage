import React, { useLayoutEffect, useMemo, useState } from "react";
import { findNewDimensions } from "../utils/utils";
import { debugBorderEnabled } from ".";
import { AXIS_COLOR, AXIS_LABEL_COLOR } from "./styles";

type Props = {
  parentDimensions: { width: number; height: number };
};

type LinesProps = {
  shown: boolean;
  position: number;
  axisLabel: string;
};

const createHorizontalLines = (height: number) => {
  const increaseBy = height / 4;
  const linesArr: LinesProps[] = [];

  for (let i = 0; i <= 4; i++) {
    linesArr.push({
      position: increaseBy * i,
      shown: true,
      axisLabel: "",
    });
  }

  linesArr[0].axisLabel = "100%";
  linesArr[2].axisLabel = "50%";
  linesArr[4].axisLabel = "0%";

  return linesArr;
};

const createVerticalLines = (width: number) => {
  const increaseBy = width / 6;
  const linesArr: LinesProps[] = [];

  const now = new Date();
  let currentHour = now.getHours() + 4;

  for (let i = 0; i <= 6; i++) {
    if (currentHour - 4 < 0) {
      currentHour = 24 - (4 - currentHour);
    } else {
      currentHour -= 4;
    }

    linesArr.push({
      position: increaseBy * i,
      shown: true,
      axisLabel: `${currentHour}`,
    });
  }

  linesArr[linesArr.length - 1].shown = false;

  return linesArr;
};

export const MainGraph = ({ parentDimensions }: Props) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (parentDimensions.height > 0) {
      console.log();
      const newDimensions = findNewDimensions(parentDimensions);
      setDimensions({ ...newDimensions });
    }
  }, [parentDimensions.width, parentDimensions.height]);

  const horizontalLines = useMemo(
    () => createHorizontalLines(dimensions.height),
    [dimensions.height]
  );

  const verticalLines = useMemo(
    () => createVerticalLines(dimensions.width),
    [dimensions.width]
  );

  return (
    <div
      style={{
        border: debugBorderEnabled ? "blue solid 2px" : undefined,
        color: "white",
        height: dimensions.height,
        width: dimensions.width,
        position: "relative",
      }}
    >
      {horizontalLines.map((line) => {
        return line.shown ? (
          <div
            style={{
              position: "absolute",
              height: "2px",
              width: dimensions.width,
              top: line.position,
              background: AXIS_COLOR,
              content: "",
            }}
          >
            <p
              style={{
                color: AXIS_LABEL_COLOR,
                padding: "0px",
                top: -8,
                margin: "0px",
                position: "absolute",
                fontSize: "16px",
                left: dimensions.width + 8,
              }}
            >
              {line.axisLabel}
            </p>
          </div>
        ) : (
          <></>
        );
      })}

      {verticalLines.map((line) => {
        return line.shown ? (
          <div
            style={{
              position: "absolute",
              height: dimensions.height + 32,
              width: 2,
              top: 0,
              right: line.position,
              background: `repeating-linear-gradient(
								to bottom,
								transparent,
								transparent 8px,
								${AXIS_COLOR} 8px,
								${AXIS_COLOR} 14px
							)`,
              content: "",
            }}
          >
            <p
              style={{
                color: AXIS_LABEL_COLOR,
                padding: "0px",
                top: dimensions.height + 18,
                margin: "0px",
                right: 4,
                position: "absolute",
                fontSize: "16px",
              }}
            >
              {line.axisLabel}
            </p>
          </div>
        ) : (
          <></>
        );
      })}

      <div
        style={{
          position: "absolute",
          height: dimensions.height + 36,
          width: 2,
          top: 0,
          left: verticalLines[verticalLines.length - 1].position - 2,
          background: AXIS_COLOR,
          content: "",
        }}
      />
    </div>
  );
};
