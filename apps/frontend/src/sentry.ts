import * as Sentry from "@sentry/react";

function readSampleRate(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : fallback;
}

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ?? import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE ?? __APP_RELEASE__,
    sendDefaultPii: false,
    tracesSampleRate: readSampleRate(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE, 0.05),
  });
}
