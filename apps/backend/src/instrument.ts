import * as Sentry from "@sentry/node";
import type { Application } from "express";

const sentryDsn = process.env.SENTRY_DSN;

function readSampleRate(value: string | undefined, fallback: number) {
	if (!value) {
		return fallback;
	}

	const parsed = Number.parseFloat(value);
	return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1
		? parsed
		: fallback;
}

if (sentryDsn) {
	const release = process.env.SENTRY_RELEASE;
	const options: Sentry.NodeOptions = {
		dsn: sentryDsn,
		environment:
			process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? "development",
		sendDefaultPii: false,
		tracesSampleRate: readSampleRate(
			process.env.SENTRY_TRACES_SAMPLE_RATE,
			0.05,
		),
	};

	if (release) {
		options.release = release;
	}

	Sentry.init(options);
}

export function setupSentryErrorHandler(app: Application) {
	if (!sentryDsn) {
		return;
	}

	Sentry.setupExpressErrorHandler(app);
}
