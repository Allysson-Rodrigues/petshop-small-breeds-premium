import { createContext } from "react";
import type {
	AuthStatus,
	SessionUser,
} from "../services/authService";

export type AuthContextValue = {
	user: SessionUser | null;
	status: AuthStatus;
	isAdmin: boolean;
	isAuthenticated: boolean;
	isBootstrapping: boolean;
	getInitials: (name: string) => string;
	logout: () => Promise<void>;
	refreshSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
