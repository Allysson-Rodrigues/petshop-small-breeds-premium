import { type ReactNode, useEffect, useState } from "react";
import type { AuthStatus, SessionUser } from "../services/authService";
import { authService } from "../services/authService";
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

		setAuthState({
			status: session ? "authenticated" : "unauthenticated",
			user: session?.user ?? null,
		});
	};

	useEffect(() => {
		let cancelled = false;

		void authService.bootstrapSession().then((session) => {
			if (cancelled) {
				return;
			}

			setAuthState({
				status: session ? "authenticated" : "unauthenticated",
				user: session?.user ?? null,
			});
		});

		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		const syncAuthState = () => {
			void refreshSession();
		};

		const authEventName = authService.getAuthChangedEventName();

		window.addEventListener(authEventName, syncAuthState);

		return () => {
			window.removeEventListener(authEventName, syncAuthState);
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
