import type { StorybookConfig } from "@storybook/react-vite";
const { default: tsconfigPaths } = require('vite-tsconfig-paths')
const { mergeConfig } = require("vite")


const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../app/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (config: StorybookConfig, options) => {
    return mergeConfig(config, {
      plugins: [
        tsconfigPaths()
      ]
    })
  }
};


export default config;
