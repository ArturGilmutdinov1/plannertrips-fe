export default defineAppConfig({
  ui: {
    colors: {
      primary: 'twilight',   // #404E7C - сумерки синий
      secondary: 'emerald',  // #86CB92 - изумруд
      neutral: 'slate'      // нейтральный
    },
    
    button: {
      default: {
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