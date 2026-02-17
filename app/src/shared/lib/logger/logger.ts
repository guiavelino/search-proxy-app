const isProduction = import.meta.env.PROD

export const logger = {
  error: (...args: unknown[]) => {
    if (!isProduction) {
      console.error(...args)
    }
  },
  warn: (...args: unknown[]) => {
    if (!isProduction) {
      console.warn(...args)
    }
  },
  info: (...args: unknown[]) => {
    if (!isProduction) {
      console.info(...args)
    }
  },
}
