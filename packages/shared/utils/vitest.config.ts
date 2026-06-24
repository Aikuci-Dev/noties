import { defineConfig } from "vitest/config";

const dirName = import.meta.dirname;

export default defineConfig({
  resolve: {
    alias: {
      "@": `${dirName}/src`,
    },
  },
});
