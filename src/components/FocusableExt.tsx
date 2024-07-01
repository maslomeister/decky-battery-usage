//  credits to https://github.com/ma3a/SDH-PlayTime

import { Focusable } from "decky-frontend-lib";
import { focus_panel_no_padding } from "../styles";

type Props = {
  className?: string;
};

export const FocusableExt: React.FC<Props> = (props) => {
  return (
    <Focusable
      className={props.className}
      style={focus_panel_no_padding}
      onActivate={() => {}}
    >
      {props.children}
    </Focusable>
  );
};
