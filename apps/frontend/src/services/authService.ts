import { isApiError, requestJson, type ApiError } from "./api";

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
	user: SessionUser;
}

export type AuthStatus =
	| "bootstrapping"
	| "authenticated"
	| "unauthenticated";

type AuthResult =
	| { ok: true }
	| {
			ok: false;
			message: string;
			errors?: Record<string, string[]>;
	  };

type BootstrapResult = AuthSession | null;

const AUTH_CHANGED_EVENT = "auth:changed";
const AUTH_SYNC_CHANNEL = "petshop-auth";

let currentUser: SessionUser | null = null;
let authNotice = "";
let authSyncChannel: BroadcastChannel | null = null;
let isAuthSyncInitialized = false;

const mapApiUserToSessionUser = (user: AuthApiUser): SessionUser => ({
	id: user.id,
	name: user.name,
	email: user.email,
	role: user.role === "admin" ? "admin" : "client",
	gender: user.gender,
});

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

	if (
		normalized === "token invalid" ||
		normalized === "user not found" ||
		normalized === "authentication required"
	) {
		return "Sua sessão expirou. Faça login novamente.";
	}

	if (status === 401 || normalized === "invalid credentials") {
		return "E-mail ou senha incorretos.";
	}

	return null;
};

const ensureAuthSyncChannel = () => {
	if (
		isAuthSyncInitialized ||
		typeof window === "undefined" ||
		typeof BroadcastChannel === "undefined"
	) {
		return;
	}

	authSyncChannel = new BroadcastChannel(AUTH_SYNC_CHANNEL);
	authSyncChannel.addEventListener("message", (event) => {
		if (event.data?.type !== AUTH_CHANGED_EVENT) {
			return;
		}

		window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
	});
	isAuthSyncInitialized = true;
};

const notifyAuthChanged = () => {
	if (typeof window !== "undefined") {
		ensureAuthSyncChannel();
		window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
		authSyncChannel?.postMessage({ type: AUTH_CHANGED_EVENT });
	}
};

const setCurrentUser = (user: SessionUser | null, notify = false) => {
	currentUser = user;

	if (notify) {
		notifyAuthChanged();
	}
};

const toLocalizedApiError = (error: ApiError): ApiError => {
	const normalizedErrors = normalizeFieldErrors(error.errors);
	const fieldErrorMessage = joinFieldErrors(normalizedErrors);

	return {
		...error,
		message:
			fieldErrorMessage ??
			mapBackendMessageToPtBr(error.message, error.status) ??
			error.message,
		errors: normalizedErrors,
	};
};

const requestCurrentUser = async (): Promise<SessionUser> => {
	const payload = await requestJson<AuthApiUser>("/auth/me");
	return mapApiUserToSessionUser(payload);
};

export const authService = {
	login: async (email: string, pass: string): Promise<AuthResult> => {
		if (!email || !pass) {
			return { ok: false, message: "Preencha e-mail e senha." };
		}

		try {
			const payload = await requestJson<{
				user?: AuthApiUser;
			}>("/auth/login", {
				method: "POST",
				body: JSON.stringify({ email, password: pass }),
			});

			if (!payload.user?.email || !payload.user?.name) {
				return {
					ok: false,
					message: "Resposta inválida do servidor.",
				};
			}

			setCurrentUser(mapApiUserToSessionUser(payload.user), true);
			return { ok: true };
		} catch (error) {
			if (isApiError(error)) {
				const apiError = toLocalizedApiError(error);
				return {
					ok: false,
					message: apiError.message,
					errors: apiError.errors,
				};
			}

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
			await requestJson("/auth/register", {
				method: "POST",
				body: JSON.stringify({ name, email, password: pass }),
			});

			return { ok: true };
		} catch (error) {
			if (isApiError(error)) {
				const apiError = toLocalizedApiError(error);
				return {
					ok: false,
					message: apiError.message,
					errors: apiError.errors,
				};
			}

			return { ok: false, message: "Falha de conexão com o servidor." };
		}
	},

	logout: async () => {
		try {
			await requestJson("/auth/logout", { method: "POST" });
		} catch {
			// Ignore logout failures and clear client state locally.
		}

		setCurrentUser(null, true);
	},

	handleUnauthorized: (message = "Sua sessão expirou. Faça login novamente.") => {
		authNotice = message;
		setCurrentUser(null, true);
	},

	consumeNotice: () => {
		if (!authNotice) {
			return "";
		}

		const notice = authNotice;
		authNotice = "";
		return notice;
	},

	isAuthenticated: () => currentUser !== null,

	getUser: (): SessionUser | null => currentUser,

	bootstrapSession: async (): Promise<BootstrapResult> => {
		try {
			const user = await requestCurrentUser();
			setCurrentUser(user);
			return { user };
		} catch (error) {
			if (isApiError(error)) {
				if (error.status === 401) {
					setCurrentUser(null);
					return null;
				}

				if (currentUser) {
					return { user: currentUser };
				}
			}

			return currentUser ? { user: currentUser } : null;
		}
	},

	getAuthChangedEventName: () => {
		ensureAuthSyncChannel();
		return AUTH_CHANGED_EVENT;
	},
};
