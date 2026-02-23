export type UserRole = "admin" | "client";

export interface User {
	name: string;
	email: string;
	role: UserRole;
}

interface AuthApiUser {
	id: string;
	name: string;
	email: string;
}

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(
	/\/$/,
	"",
);

const resolveAdminEmails = (): Set<string> => {
	const raw = import.meta.env.VITE_ADMIN_EMAILS ?? "admin@petshop.com";
	return new Set(
		raw
			.split(",")
			.map((email: string) => email.trim().toLowerCase())
			.filter(Boolean),
	);
};

const adminEmails = resolveAdminEmails();

const resolveRole = (email: string): UserRole => {
	return adminEmails.has(email.toLowerCase()) ? "admin" : "client";
};

const mapApiUserToSessionUser = (user: AuthApiUser): User => ({
	name: user.name,
	email: user.email,
	role: resolveRole(user.email),
});

type AuthResult =
	| { ok: true }
	| {
			ok: false;
			message: string;
	  };

const getErrorMessageFromResponse = async (response: Response): Promise<string> => {
	try {
		const payload = (await response.json()) as { message?: unknown };
		if (typeof payload?.message === "string" && payload.message.trim()) {
			return payload.message;
		}
	} catch {
		// ignore parse errors
	}

	return response.status === 401
		? "Credenciais inválidas."
		: "Não foi possível concluir a solicitação.";
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
	},

	logout: () => {
		localStorage.removeItem(AUTH_TOKEN_KEY);
		localStorage.removeItem(AUTH_USER_KEY);
	},

	isAuthenticated: () => {
		return !!localStorage.getItem(AUTH_TOKEN_KEY);
	},

	getToken: (): string | null => {
		return localStorage.getItem(AUTH_TOKEN_KEY);
	},

	getUser: (): User | null => {
		const userJson = localStorage.getItem(AUTH_USER_KEY);
		if (!userJson) return null;
		try {
			return JSON.parse(userJson) as User;
		} catch {
			return null;
		}
	},
};
