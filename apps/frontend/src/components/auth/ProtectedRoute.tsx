import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AppLoader from "../ui/AppLoader";
import { resolveProtectedRouteDecision } from "./guard-utils";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
	const { isAuthenticated, isBootstrapping } = useAuth();
	const location = useLocation();
	const decision = resolveProtectedRouteDecision({
		isAuthenticated,
		isBootstrapping,
		currentPath: `${location.pathname}${location.search}${location.hash}`,
	});

	if (decision.kind === "loader") {
		return <AppLoader label="Validando sessão..." />;
	}

	if (decision.kind === "redirect") {
		return (
			<Navigate
				to={decision.to}
				replace
				state={{
					from: decision.from,
				}}
			/>
		);
	}

	return <>{children}</>;
}
