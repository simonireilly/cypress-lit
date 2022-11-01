import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      /**
       * You will see a warning svelte is not installed, but that
       * can be ignored 🤷‍♂️
       */
      framework: "svelte",
      bundler: "vite",
    },
  },
  experimentalWebKitSupport: true,
});
