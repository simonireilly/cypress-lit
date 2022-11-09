import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    supportFile: "cypress/support/component.ts",
    devServer: {
      bundler: "vite",
    },
    indexHtmlFile: "cypress/support/component-index.html",
  },
  experimentalWebKitSupport: true,
});
