import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AppLoader from "../ui/AppLoader";
import { resolveGuestRouteDecision } from "./guard-utils";

export default function GuestOnlyRoute({ children }: { children: ReactNode }) {
	const { isAuthenticated, isBootstrapping } = useAuth();
	const decision = resolveGuestRouteDecision({
		isAuthenticated,
		isBootstrapping,
	});

	if (decision.kind === "loader") {
		return <AppLoader label="Carregando acesso..." />;
	}

	if (decision.kind === "redirect") {
		return <Navigate to={decision.to} replace />;
	}

	return <>{children}</>;
}
