import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const REQUEST_ID_HEADER = "X-Request-Id";

const readIncomingRequestId = (request: Request): string | null => {
	const requestId = request.header(REQUEST_ID_HEADER);
	if (!requestId || requestId.trim().length === 0) {
		return null;
	}

	return requestId.trim();
};

export const requestIdMiddleware = (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	const requestId = readIncomingRequestId(request) ?? randomUUID();

	request.requestId = requestId;
	response.setHeader(REQUEST_ID_HEADER, requestId);

	next();
};
