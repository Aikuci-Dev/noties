import { isDevelopment } from "std-env";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: isDevelopment },
  sourcemap: isDevelopment,
  future: { compatibilityVersion: 5 },
  experimental: { nitroAutoImports: true },
  imports: { dirs: ["utils/types"] },
  modules: ["@nuxt/ui"],
  ui: {
    theme: {
      // https://ui.nuxt.com/docs/getting-started/theme/design-system#extend-colors
      colors: [
        "primary",
        "secondary",
        "tertiary",
        "info",
        "success",
        "warning",
        "error",
      ],
      defaultVariants: { size: "sm" },
      prefix: "tw",
    },
    content: true,
    experimental: { componentDetection: true },
  },
  fonts: {
    processCSSVariables: true,
  },
  css: ["~/assets/css/main.css"],
});
