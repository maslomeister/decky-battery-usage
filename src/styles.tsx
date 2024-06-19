import { CSSProperties } from "react";
import { FocusableExt } from "./components/FocusableExt";

export const BLUE_COLOR = "#1A9FFF";
// const DARK_GREY = "#4c4c4c";
// const DEFAULT_BORDER_RADIUS = "2px";

export const pager_container: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};

export const VerticalContainerCSS = {
  vertical__container: {
    display: "flex",
    flexDirection: "column",
    alignContent: "space-between",
  } as CSSProperties,
};

export const focus_panel_no_padding: CSSProperties = {
  padding: "0px 0px",
};

export const hide_text_on_overflow: CSSProperties = {
  textOverflow: "ellipsis",
  overflow: "hidden",
  width: "100%",
  whiteSpace: "nowrap",
};
