import React from "react";

type Props = {
  dimensions: { width: number; height: number };
};

export const RightGraphPadding = ({ dimensions }: Props) => {
  return (
    <div style={{ border: "green solid 2px", color: "white", flexGrow: "1" }}>
      right
    </div>
  );
};
