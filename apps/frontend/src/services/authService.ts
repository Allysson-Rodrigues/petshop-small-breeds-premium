export type UserRole = "admin" | "client";

export interface User {
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

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";
const AUTH_CHANGED_EVENT = "auth:changed";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(
	/\/$/,
	"",
);

const mapApiUserToSessionUser = (user: AuthApiUser): User => ({
	id: user.id,
	name: user.name,
	email: user.email,
	role: user.role === "admin" ? "admin" : "client",
	gender: user.gender,
});

type StoredSession = {
	token: string;
	user: User;
};

type JwtPayload = {
	exp?: number;
};

type AuthResult =
	| { ok: true }
	| {
			ok: false;
			message: string;
	  };

const mapBackendMessageToPtBr = (
	message: string,
	status: number,
): string | null => {
	const normalized = message.trim().toLowerCase();

	if (status === 401 || normalized === "invalid credentials") {
		return "E-mail ou senha incorretos.";
	}

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

	if (status === 409) {
		return "Este e-mail já está cadastrado.";
	}

	if (status === 422) {
		return "Dados inválidos. Revise os campos e tente novamente.";
	}

	if (normalized === "unable to register user") {
		return "Não foi possível criar a conta no servidor. Tente novamente.";
	}

	return null;
};

const getErrorMessageFromResponse = async (response: Response): Promise<string> => {
	try {
		const payload = (await response.json()) as { message?: unknown };
		if (typeof payload?.message === "string" && payload.message.trim()) {
			return (
				mapBackendMessageToPtBr(payload.message, response.status) ??
				payload.message
			);
		}
	} catch {
		// ignore parse errors
	}

	return response.status === 401
		? "E-mail ou senha incorretos."
		: "Não foi possível concluir a solicitação.";
};

const notifyAuthChanged = () => {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
	}
};

const clearStoredSession = (shouldNotify: boolean) => {
	localStorage.removeItem(AUTH_TOKEN_KEY);
	localStorage.removeItem(AUTH_USER_KEY);

	if (shouldNotify) {
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

const readStoredUser = (): User | null => {
	const userJson = localStorage.getItem(AUTH_USER_KEY);
	if (!userJson) {
		return null;
	}

	try {
		return JSON.parse(userJson) as User;
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
				return {
					ok: false,
					message: await getErrorMessageFromResponse(response),
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

	register: async (name: string, email: string, pass: string): Promise<AuthResult> => {
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
				return {
					ok: false,
					message: await getErrorMessageFromResponse(response),
				};
			}

			return { ok: true };
		} catch {
			return { ok: false, message: "Falha de conexão com o servidor." };
		}
	},

	saveSession: (token: string, user: User) => {
		localStorage.setItem(AUTH_TOKEN_KEY, token);
		localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
		notifyAuthChanged();
	},

	logout: () => {
		clearStoredSession(true);
	},

	isAuthenticated: () => {
		return authService.getSession() !== null;
	},

	getToken: (): string | null => {
		return authService.getSession()?.token ?? null;
	},

	getUser: (): User | null => {
		return authService.getSession()?.user ?? null;
	},

	getSession: (): StoredSession | null => {
		const token = localStorage.getItem(AUTH_TOKEN_KEY);
		const user = readStoredUser();

		if (!token || !user) {
			if (token || localStorage.getItem(AUTH_USER_KEY)) {
				clearStoredSession(false);
			}
			return null;
		}

		if (isTokenExpired(token)) {
			clearStoredSession(true);
			return null;
		}

		return { token, user };
	},

	handleUnauthorized: () => {
		clearStoredSession(true);

		if (typeof window !== "undefined" && window.location.pathname !== "/login") {
			window.location.assign("/login");
		}
	},
};
