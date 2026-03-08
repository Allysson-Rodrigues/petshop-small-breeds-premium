export type UserRole = "admin" | "client";

export interface SessionUser {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	gender?: "male" | "female";
}

interface AuthApiUser {
	id: string;
	name: string;
	email: string;
	role: string;
	gender?: "male" | "female";
}

export interface AuthSession {
	token: string;
	user: SessionUser;
}

export type AuthStatus =
	| "bootstrapping"
	| "authenticated"
	| "unauthenticated";

export interface ApiError {
	status: number;
	message: string;
	errors?: Record<string, string[]>;
}

type AuthResult =
	| { ok: true }
	| {
			ok: false;
			message: string;
	  };

type BootstrapResult = AuthSession | null;

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";
const AUTH_NOTICE_KEY = "auth_notice";
const AUTH_CHANGED_EVENT = "auth:changed";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(
	/\/$/,
	"",
);

const mapApiUserToSessionUser = (user: AuthApiUser): SessionUser => ({
	id: user.id,
	name: user.name,
	email: user.email,
	role: user.role === "admin" ? "admin" : "client",
	gender: user.gender,
});

type JwtPayload = {
	exp?: number;
};

const normalizeFieldErrors = (
	value: unknown,
): Record<string, string[]> | undefined => {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		return undefined;
	}

	const entries = Object.entries(value)
		.map(([key, fieldValue]) => {
			if (!Array.isArray(fieldValue)) {
				return null;
			}

			const normalizedMessages = fieldValue.filter(
				(item): item is string => typeof item === "string" && item.trim().length > 0,
			);

			if (normalizedMessages.length === 0) {
				return null;
			}

			return [key, normalizedMessages] as const;
		})
		.filter(
			(entry): entry is readonly [string, string[]] => entry !== null,
		);

	if (entries.length === 0) {
		return undefined;
	}

	return Object.fromEntries(entries);
};

const joinFieldErrors = (errors?: Record<string, string[]>) => {
	if (!errors) {
		return null;
	}

	const messages = Object.values(errors).flat();
	return messages.length > 0 ? messages.join(" ") : null;
};

const mapBackendMessageToPtBr = (
	message: string,
	status: number,
): string | null => {
	const normalized = message.trim().toLowerCase();

	if (normalized === "email already registered") {
		return "Este e-mail já está cadastrado.";
	}

	if (normalized === "missing parameters") {
		return "Preencha todos os campos.";
	}

	if (normalized === "invalid email") {
		return "Informe um e-mail válido.";
	}

	if (normalized === "invalid name") {
		return "Informe um nome válido.";
	}

	if (normalized === "password must have at least 6 characters") {
		return "A senha deve ter pelo menos 6 caracteres.";
	}

	if (normalized === "validation error" && status === 422) {
		return "Dados inválidos. Revise os campos e tente novamente.";
	}

	if (normalized === "unable to register user") {
		return "Não foi possível criar a conta no servidor. Tente novamente.";
	}

	if (normalized === "token invalid" || normalized === "user not found") {
		return "Sua sessão expirou. Faça login novamente.";
	}

	if (status === 401 || normalized === "invalid credentials") {
		return "E-mail ou senha incorretos.";
	}

	return null;
};

const persistNotice = (message: string) => {
	sessionStorage.setItem(AUTH_NOTICE_KEY, message);
};

const notifyAuthChanged = () => {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
	}
};

const clearStoredSession = ({
	notify,
	notice,
}: {
	notify: boolean;
	notice?: string;
}) => {
	localStorage.removeItem(AUTH_TOKEN_KEY);
	localStorage.removeItem(AUTH_USER_KEY);

	if (notice) {
		persistNotice(notice);
	}

	if (notify) {
		notifyAuthChanged();
	}
};

const decodeJwtPayload = (token: string): JwtPayload | null => {
	const [, payload] = token.split(".");
	if (!payload) {
		return null;
	}

	try {
		const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
		const decodedPayload = atob(normalizedPayload);
		return JSON.parse(decodedPayload) as JwtPayload;
	} catch {
		return null;
	}
};

const readStoredUser = (): SessionUser | null => {
	const userJson = localStorage.getItem(AUTH_USER_KEY);
	if (!userJson) {
		return null;
	}

	try {
		return JSON.parse(userJson) as SessionUser;
	} catch {
		return null;
	}
};

const isTokenExpired = (token: string): boolean => {
	const payload = decodeJwtPayload(token);
	if (!payload || typeof payload.exp !== "number") {
		return true;
	}

	return payload.exp * 1000 <= Date.now();
};

const buildApiError = async (response: Response): Promise<ApiError> => {
	try {
		const payload = (await response.json()) as {
			message?: unknown;
			errors?: unknown;
		};

		const fieldErrors = normalizeFieldErrors(payload.errors);
		const fieldErrorMessage = joinFieldErrors(fieldErrors);
		const rawMessage =
			typeof payload.message === "string" && payload.message.trim()
				? payload.message
				: fieldErrorMessage ?? `Request failed: ${response.status}`;

		return {
			status: response.status,
			message:
				fieldErrorMessage ??
				mapBackendMessageToPtBr(rawMessage, response.status) ??
				rawMessage,
			errors: fieldErrors,
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

const requestCurrentUser = async (token: string): Promise<SessionUser> => {
	const response = await fetch(`${API_BASE_URL}/auth/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw await buildApiError(response);
	}

	const payload = (await response.json()) as AuthApiUser;
	return mapApiUserToSessionUser(payload);
};

export const authService = {
	login: async (email: string, pass: string): Promise<AuthResult> => {
		if (!email || !pass) {
			return { ok: false, message: "Preencha e-mail e senha." };
		}

		try {
			const response = await fetch(`${API_BASE_URL}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password: pass }),
			});

			if (!response.ok) {
				const apiError = await buildApiError(response);
				return {
					ok: false,
					message: apiError.message,
				};
			}

			const payload = (await response.json()) as {
				token?: string;
				user?: AuthApiUser;
			};

			if (!payload.token || !payload.user?.email || !payload.user?.name) {
				return {
					ok: false,
					message: "Resposta inválida do servidor.",
				};
			}

			authService.saveSession(payload.token, mapApiUserToSessionUser(payload.user));
			return { ok: true };
		} catch {
			return { ok: false, message: "Falha de conexão com o servidor." };
		}
	},

	register: async (
		name: string,
		email: string,
		pass: string,
	): Promise<AuthResult> => {
		if (!name || !email || !pass) {
			return { ok: false, message: "Preencha todos os campos." };
		}

		try {
			const response = await fetch(`${API_BASE_URL}/auth/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, password: pass }),
			});

			if (!response.ok) {
				const apiError = await buildApiError(response);
				return {
					ok: false,
					message: apiError.message,
				};
			}

			return { ok: true };
		} catch {
			return { ok: false, message: "Falha de conexão com o servidor." };
		}
	},

	saveSession: (token: string, user: SessionUser, notify = true) => {
		localStorage.setItem(AUTH_TOKEN_KEY, token);
		localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

		if (notify) {
			notifyAuthChanged();
		}
	},

	logout: () => {
		clearStoredSession({ notify: true });
	},

	handleUnauthorized: (message = "Sua sessão expirou. Faça login novamente.") => {
		clearStoredSession({
			notify: true,
			notice: message,
		});
	},

	consumeNotice: () => {
		const notice = sessionStorage.getItem(AUTH_NOTICE_KEY);
		if (!notice) {
			return "";
		}

		sessionStorage.removeItem(AUTH_NOTICE_KEY);
		return notice;
	},

	isAuthenticated: () => {
		return authService.getSession() !== null;
	},

	getToken: (): string | null => {
		return authService.getSession()?.token ?? null;
	},

	getUser: (): SessionUser | null => {
		return authService.getSession()?.user ?? null;
	},

	getSession: (): AuthSession | null => {
		const token = localStorage.getItem(AUTH_TOKEN_KEY);
		const user = readStoredUser();

		if (!token || !user) {
			if (token || localStorage.getItem(AUTH_USER_KEY)) {
				clearStoredSession({ notify: false });
			}
			return null;
		}

		if (isTokenExpired(token)) {
			clearStoredSession({
				notify: true,
				notice: "Sua sessão expirou. Faça login novamente.",
			});
			return null;
		}

		return { token, user };
	},

	bootstrapSession: async (): Promise<BootstrapResult> => {
		const session = authService.getSession();
		if (!session) {
			return null;
		}

		try {
			const user = await requestCurrentUser(session.token);
			authService.saveSession(session.token, user, false);
			return { token: session.token, user };
		} catch (error) {
			const apiError = error as ApiError;

			if (apiError?.status === 401) {
				authService.handleUnauthorized(
					apiError.message || "Sua sessão expirou. Faça login novamente.",
				);
				return null;
			}

			return session;
		}
	},

	getAuthChangedEventName: () => AUTH_CHANGED_EVENT,
};
