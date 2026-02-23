import { authService } from "../services/authService";

export function useAuth() {
    const user = authService.getUser();
    const isAdmin = user?.role === "admin";

    const getInitials = (name: string): string => {
        if (!name) return "??";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return {
        user,
        isAdmin,
        getInitials,
        isAuthenticated: authService.isAuthenticated(),
        logout: authService.logout,
    };
}
