import type { Preview } from "@storybook/react";

//blue - 209CFB
//grey - 32373D

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "white",
      values: [
        {
          name: "steam",
          value: "#0D141C",
        },
        {
          name: "white",
          value: "#ffffff",
        },
      ],
    },
  },
};

export default preview;
