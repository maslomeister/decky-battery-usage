import { ReactNode } from "react";
import image from "./deck.jpg";

type Props = {
  children: ReactNode;
};

export const DeckMockup = (props: Props) => {
  return (
    <div
      style={{
        position: "relative",
        width: "348px",
        height: "454px",
        backgroundImage: `url(${image})`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "54px",
          right: 0,
          width: "300px",
          height: "400px",
        }}
      >
        <div
          style={{
            margin: "0px 16px",
            // padding: "0px 16px",
            background: "#0d141c",
            width: "calc(100% - 32px)",
            height: "100%",
          }}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
};
