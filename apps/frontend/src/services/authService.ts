export type UserRole = "admin" | "client";

export interface User {
    name: string;
    email: string;
    role: UserRole;
}

interface StoredUser {
    id: string;
    name: string;
    email: string;
    passHash: string;
}

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";
const MOCK_USERS_KEY = "mock_users";

const simpleHash = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return `h_${Math.abs(hash).toString(36)}`;
};

export const authService = {
    login: async (email: string, pass: string): Promise<boolean> => {
        await new Promise((resolve) => setTimeout(resolve, 200));

        if (!email || !pass) return false;

        if (email === "admin@petshop.com" && pass === "admin123") {
            const adminUser: User = {
                name: "Admin Geral",
                email,
                role: "admin",
            };
            authService.saveSession("simulated_jwt_token_admin_456", adminUser);
            return true;
        }

        const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "[]");
        const passHash = simpleHash(pass);
        const found = storedUsers.find((u) => u.email === email && u.passHash === passHash);

        if (found) {
            const clientUser: User = {
                name: found.name,
                email: found.email,
                role: "client",
            };
            authService.saveSession(`simulated_jwt_token_user_${found.id}`, clientUser);
            return true;
        }

        return false;
    },

    register: async (name: string, email: string, pass: string): Promise<boolean> => {
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (!name || !email || !pass) return false;

        const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "[]");

        if (storedUsers.some((u) => u.email === email)) {
            return false;
        }

        const newUser: StoredUser = {
            id: crypto.randomUUID(),
            name,
            email,
            passHash: simpleHash(pass),
        };
        storedUsers.push(newUser);
        localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(storedUsers));

        return true;
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
