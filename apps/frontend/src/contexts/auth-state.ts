import type { AuthStatus, SessionUser } from "../services/authService";

export type AuthState = {
	status: AuthStatus;
	user: SessionUser | null;
};

export type AuthSyncDetail = {
	source?: "local" | "remote";
	user?: SessionUser | null;
};

export function createResolvedAuthState(user: SessionUser | null): AuthState {
	return {
		status: user ? "authenticated" : "unauthenticated",
		user,
	};
}

export function shouldRefreshSessionOnAuthSync(
	detail?: AuthSyncDetail,
): boolean {
	return detail?.source !== "local";
}
