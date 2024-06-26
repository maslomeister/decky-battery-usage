//  credits to https://github.com/ma3a/SDH-PlayTime

import { HorizontalContainerCSS } from "../styles";

export const HorizontalContainer: React.FC<{}> = (props) => {
  return (
    <div style={HorizontalContainerCSS.horizontal__container}>
      {props.children}
    </div>
  );
};
