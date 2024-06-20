import { StoryFn, Meta } from "@storybook/react";

import { UsageGraph, UsageGraphProps, debugBorderEnabled } from ".";
import { DeckMockup } from "../DeckMocup";

// main quickAccess window size 348 width 454 height
// the plugin window 300 by 440, top padding 14

export default {
  title: "UsageGraph",
  component: UsageGraph,
} as Meta;

export const Default: StoryFn<UsageGraphProps> = (args) => (
  <DeckMockup>
    <UsageGraph {...args} />
  </DeckMockup>
);
