const level = (() => {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("log") || "warn";
  } catch {
    return "warn";
  }
})();

const levels = { debug: 0, info: 1, warn: 2, error: 3 } as const;
const current = levels[level as keyof typeof levels] ?? 2;

function tags(module: string) {
  return `[${module.toUpperCase()}]`;
}

export const logger = {
  debug: (module: string, msg: string, data?: unknown) => {
    if (current <= 0) console.debug(tags(module), msg, ...(data !== undefined ? [data] : []));
  },
  info: (module: string, msg: string, data?: unknown) => {
    if (current <= 1) console.info(tags(module), msg, ...(data !== undefined ? [data] : []));
  },
  warn: (module: string, msg: string, data?: unknown) => {
    if (current <= 2) console.warn(tags(module), msg, ...(data !== undefined ? [data] : []));
  },
  error: (module: string, msg: string, data?: unknown) => {
    if (current <= 3) console.error(tags(module), msg, ...(data !== undefined ? [data] : []));
  },
};
