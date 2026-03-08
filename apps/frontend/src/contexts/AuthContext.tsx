import { type ReactNode, useEffect, useState } from "react";
import { authService, type User } from "../services/authService";
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

const readSessionUser = () => authService.getUser();

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(() => readSessionUser());
	const isAuthenticated = user !== null;

	useEffect(() => {
		const syncAuthState = () => {
			setUser(readSessionUser());
		};

		window.addEventListener("storage", syncAuthState);
		window.addEventListener("auth:changed", syncAuthState);

		return () => {
			window.removeEventListener("storage", syncAuthState);
			window.removeEventListener("auth:changed", syncAuthState);
		};
	}, []);

	return (
		<AuthContext.Provider
				value={{
					user,
					isAdmin: user?.role === "admin",
					isAuthenticated,
					getInitials,
					logout: authService.logout,
				}}
			>
			{children}
		</AuthContext.Provider>
	);
}
