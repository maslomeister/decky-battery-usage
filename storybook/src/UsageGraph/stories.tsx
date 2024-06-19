import { StoryFn, Meta } from "@storybook/react";

import { UsageGraph, UsageGraphProps, debugBorderEnabled } from ".";

export default {
  title: "UsageGraph",
  component: UsageGraph,
} as Meta;

export const Default: StoryFn<UsageGraphProps> = (args) => (
  <div
    style={{
      width: "300px",
      height: "992px",
      border: debugBorderEnabled ? "pink solid 8px" : undefined,
    }}
  >
    <UsageGraph {...args} />
  </div>
);
