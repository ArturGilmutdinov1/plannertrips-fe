export default defineAppConfig({
  ui: {
    colors: {
      primary: "twilight",
      secondary: "emerald",
      accent: "sand",
      neutral: "slate",
    },
    button: {
      defaultVariants: {
        color: "primary",
        variant: "solid",
      },
    },
    pageHeader: {
      slots: {
        root: () => "relative py-4",
        title: () => "text-xl font-bold text-highlighted",
        description: () => "text-sm",
      },
    },
  },
});
