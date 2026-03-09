export interface ApiError {
	code?: string;
	requestId?: string;
	status: number;
	message: string;
	errors?: Record<string, string[]>;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(
	/\/$/,
	"",
);

export const apiUrl = (path: string): string => `${API_BASE_URL}${path}`;

export const isApiError = (value: unknown): value is ApiError => {
	return (
		typeof value === "object" &&
		value !== null &&
		"status" in value &&
		"message" in value
	);
};

export const buildApiError = async (
	response: Response,
): Promise<ApiError> => {
	try {
		const payload = (await response.json()) as {
			code?: unknown;
			message?: unknown;
			errors?: unknown;
			requestId?: unknown;
		};

		return {
			code: typeof payload.code === "string" ? payload.code : undefined,
			requestId:
				typeof payload.requestId === "string" ? payload.requestId : undefined,
			status: response.status,
			message:
				typeof payload.message === "string" && payload.message.trim().length > 0
					? payload.message
					: `Request failed: ${response.status}`,
			errors:
				payload.errors &&
				typeof payload.errors === "object" &&
				!Array.isArray(payload.errors)
					? (payload.errors as Record<string, string[]>)
					: undefined,
		};
	} catch {
		return {
			status: response.status,
			message:
				response.status === 401
					? "Sua sessão expirou. Faça login novamente."
					: "Não foi possível concluir a solicitação.",
		};
	}
};

export const requestJson = async <T>(
	path: string,
	options: RequestInit = {},
): Promise<T> => {
	const hasBody = options.body !== undefined;
	const response = await fetch(apiUrl(path), {
		credentials: "include",
		...options,
		headers: {
			Accept: "application/json",
			...(hasBody ? { "Content-Type": "application/json" } : {}),
			...(options.headers ?? {}),
		},
	});

	if (!response.ok) {
		throw await buildApiError(response);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	const text = await response.text();
	if (!text) {
		return undefined as T;
	}

	return JSON.parse(text) as T;
};
