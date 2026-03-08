import type { ReactNode } from "react";
import type { UserRole } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

type RoleGuardProps = {
	allowedRoles: UserRole[];
	children: ReactNode;
	fallback: ReactNode;
};

export default function RoleGuard({
	allowedRoles,
	children,
	fallback,
}: RoleGuardProps) {
	const { user } = useAuth();

	if (!user || !allowedRoles.includes(user.role)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
