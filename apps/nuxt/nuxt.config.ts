import tailwindcss from "@tailwindcss/vite";
import { isDevelopment } from "std-env";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: isDevelopment },
  sourcemap: isDevelopment,
  future: { compatibilityVersion: 5 },
  experimental: { nitroAutoImports: true },
  imports: { dirs: ["utils/types"] },

  vite: {
    // @ts-expect-error any
    plugins: [tailwindcss()],
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === "wc-datepicker",
    },
  },

  css: ["~/assets/css/main.css", "~/assets/css/wc-datepicker.css"],
  modules: ["@vueuse/nuxt", "@nuxt/icon", "@formkit/auto-animate/nuxt"],
  icon: {
    serverBundle: {
      collections: ["lucide"],
    },
  },
});
