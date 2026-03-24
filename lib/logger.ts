const isProd = process.env.NODE_ENV === "production";

export const logger = {
  info: (...args: unknown[]) => console.info(...args),
  error: (...args: unknown[]) => console.error(...args),
  warn: (...args: unknown[]) => {
    if (!isProd) console.warn(...args);
  },
  debug: (...args: unknown[]) => {
    if (!isProd) console.debug(...args);
  },
  log: (...args: unknown[]) => {
    if (!isProd) console.log(...args);
  },
};
