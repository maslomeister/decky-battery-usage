import { StoryFn, Meta } from "@storybook/react";

import { FirstComponent, FirstComponentProps } from ".";

export default {
  title: "FirstComponent",
  component: FirstComponent,
} as Meta;

export const Default: StoryFn<FirstComponentProps> = (args) => (
  <div style={{ width: "300px", height: "992px", border: "pink solid 8px" }}>
    <FirstComponent {...args} />
  </div>
);
