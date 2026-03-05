import { createContext } from "react";
import type { User } from "../services/authService";

export type AuthContextValue = {
	user: User | null;
	isAdmin: boolean;
	isAuthenticated: boolean;
	getInitials: (name: string) => string;
	logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
