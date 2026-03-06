export default defineAppConfig({
  ui: {
    // https://ui.nuxt.com/docs/getting-started/theme/design-system#runtime-configuration
    colors: {
      primary: "blue",
      secondary: "sky",
      tertiary: "slate",
      info: "cyan",
      neutral: "gray",
    },

    container: {
      base: "tw:p-0! tw-h-screen tw:shadow-2xl",
    },
  },
});
