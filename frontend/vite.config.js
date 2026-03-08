import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    open: false
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setupTests.js",
    css: true
  }
});
