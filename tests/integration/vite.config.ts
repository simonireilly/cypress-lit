import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    watch: {
      followSymlinks: true,
    },
    fs: {
      allow: ["../../packages/mount", "./"],
    },
  },
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
    rollupOptions: {
      external: /^lit/,
    },
  },
});
