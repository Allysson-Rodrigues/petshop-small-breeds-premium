export type HttpResponse = {
	statusCode: number;
	body: unknown;
};

export type HttpRequest = {
	body?: Record<string, unknown>;
	params?: Record<string, unknown>;
	query?: Record<string, unknown>;
	headers?: Record<string, string | string[] | undefined>;
};
