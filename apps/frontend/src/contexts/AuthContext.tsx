import { type ReactNode, useEffect, useEffectEvent, useState } from "react";
import type { AuthStatus, SessionUser } from "../services/authService";
import { authService } from "../services/authService";
import {
	createResolvedAuthState,
	type AuthSyncDetail,
	shouldRefreshSessionOnAuthSync,
} from "./auth-state";
import { AuthContext } from "./auth-context";

const getInitials = (name: string): string => {
	if (!name) return "??";
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.substring(0, 2);
};

export function AuthProvider({ children }: { children: ReactNode }) {
	const [authState, setAuthState] = useState<{
		status: AuthStatus;
		user: SessionUser | null;
	}>(() => ({
		status: "bootstrapping",
		user: authService.getUser(),
	}));

	const applySessionState = (user: SessionUser | null) => {
		setAuthState(createResolvedAuthState(user));
	};

	const refreshSession = async () => {
		setAuthState((currentState) =>
			currentState.status === "bootstrapping"
				? currentState
				: {
						...currentState,
						status: "bootstrapping",
					},
		);

		const session = await authService.bootstrapSession();

		applySessionState(session?.user ?? null);
	};

	useEffect(() => {
		let cancelled = false;

		void authService.bootstrapSession().then((session) => {
			if (cancelled) {
				return;
			}

			applySessionState(session?.user ?? null);
		});

		return () => {
			cancelled = true;
		};
	}, []);

	const handleAuthStateSync = useEffectEvent((event: Event) => {
		const customEvent = event as CustomEvent<AuthSyncDetail>;

		if (!shouldRefreshSessionOnAuthSync(customEvent.detail)) {
			applySessionState(customEvent.detail.user ?? null);
			return;
		}

		void refreshSession();
	});

	useEffect(() => {
		const authEventName = authService.getAuthChangedEventName();

		window.addEventListener(authEventName, handleAuthStateSync);

		return () => {
			window.removeEventListener(authEventName, handleAuthStateSync);
		};
	}, []);

	const isAuthenticated =
		authState.status === "authenticated" && authState.user !== null;

	return (
		<AuthContext.Provider
			value={{
				user: authState.user,
				status: authState.status,
				isAdmin: authState.user?.role === "admin",
				isAuthenticated,
				isBootstrapping: authState.status === "bootstrapping",
				getInitials,
				logout: authService.logout,
				refreshSession,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
