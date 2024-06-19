import React from "react";

type Props = {
  dimensions: { width: number; height: number };
};

export const BottomGraphPadding = ({ dimensions }: Props) => {
  return (
    <div style={{ border: "red solid 2px", color: "white", flexGrow: "1" }}>
      bottom
    </div>
  );
};
