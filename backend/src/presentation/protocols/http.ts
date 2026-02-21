export type HttpResponse = {
	statusCode: number;
	body: unknown;
};

export type HttpRequest = {
	body?: unknown;
	params?: unknown;
	query?: unknown;
	headers?: unknown;
};
