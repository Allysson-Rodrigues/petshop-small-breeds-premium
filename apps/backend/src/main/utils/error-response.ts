import type { Response } from "express";
import type { ErrorDetails } from "../../domain/errors/app-error.js";

interface ErrorResponseOptions {
	code: string;
	errors?: ErrorDetails | undefined;
	message: string;
	statusCode: number;
	type?: string | undefined;
}

const getResponseRequestId = (response: Response): string | undefined => {
	const requestId = response.getHeader("X-Request-Id");
	return typeof requestId === "string" && requestId.trim().length > 0
		? requestId
		: undefined;
};

export const normalizeErrorCode = (value: string): string =>
	value
		.replace(/([a-z0-9])([A-Z])/g, "$1_$2")
		.replace(/[^a-zA-Z0-9]+/g, "_")
		.toUpperCase();

export const sendErrorResponse = (
	response: Response,
	{ code, errors, message, statusCode, type }: ErrorResponseOptions,
) => {
	const requestId = getResponseRequestId(response);

	return response.status(statusCode).json({
		status: "error",
		code,
		type,
		message,
		...(errors ? { errors } : {}),
		...(requestId ? { requestId } : {}),
	});
};
