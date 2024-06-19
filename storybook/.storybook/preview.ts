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
      default: "steam",
      values: [
        {
          name: "steam",
          value: "#0D141C",
        },
      ],
    },
  },
};

export default preview;
