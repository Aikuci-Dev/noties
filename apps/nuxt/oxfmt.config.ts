import { defineConfig } from "oxfmt";

import { oxc } from "../../base.js";

export default defineConfig({
  ...oxc.oxfmt,
  sortTailwindcss: {
    stylesheet: "./app/assets/css/main.css",
  },
});
