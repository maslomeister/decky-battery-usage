//  credits to https://github.com/ma3a/SDH-PlayTime

import { Focusable } from "decky-frontend-lib";
import { focus_panel_no_padding } from "../styles";

type Props = {
  style?: React.CSSProperties;
};

export const FocusableExt: React.FC<Props> = (props) => {
  return (
    <Focusable
      style={{ ...focus_panel_no_padding, ...props.style }}
      onActivate={() => {}}
    >
      {props.children}
    </Focusable>
  );
};
