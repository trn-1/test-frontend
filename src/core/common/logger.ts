interface Logger {
  warn(message: string, meta?: Record<string, unknown>): void
  error(e: Error | unknown): void
}

const logger: Logger = {
  warn(message, meta) {
    console.warn(message, meta) // eslint-disable-line
  },
  error(e) {
    if (e instanceof Error) {
      console.error(e.message) // eslint-disable-line
    } else {
      console.error(String(e)) // eslint-disable-line
    }
  },
}

export default logger
