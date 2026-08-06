export default defineAppConfig({
  ui: {
    colors: {
      primary: 'twilight',
      secondary: 'emerald',
      accent: 'sand',
      neutral: 'slate'
    },
    button: {
      defaultVariants: {
        color: 'primary',
        variant: 'solid'
      }
    },
    card: {
      slots: {
        root: 'border border-twilight-200 dark:border-twilight-800 shadow-sm hover:shadow-md transition-shadow',
        header: 'bg-twilight-50 dark:bg-twilight-950/50 border-b border-twilight-200 dark:border-twilight-800'
      }
    }
  }
})