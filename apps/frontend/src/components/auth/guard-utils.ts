export type ProtectedRouteDecision =
	| { kind: "loader" }
	| { kind: "redirect"; to: string; from: string }
	| { kind: "content" };

export const resolveProtectedRouteDecision = ({
	isAuthenticated,
	isBootstrapping,
	currentPath,
}: {
	isAuthenticated: boolean;
	isBootstrapping: boolean;
	currentPath: string;
}): ProtectedRouteDecision => {
	if (isBootstrapping) {
		return { kind: "loader" };
	}

	if (!isAuthenticated) {
		return {
			kind: "redirect",
			to: "/login",
			from: currentPath,
		};
	}

	return { kind: "content" };
};

export type GuestRouteDecision =
	| { kind: "loader" }
	| { kind: "redirect"; to: string }
	| { kind: "content" };

export const resolveGuestRouteDecision = ({
	isAuthenticated,
	isBootstrapping,
}: {
	isAuthenticated: boolean;
	isBootstrapping: boolean;
}): GuestRouteDecision => {
	if (isBootstrapping) {
		return { kind: "loader" };
	}

	if (isAuthenticated) {
		return { kind: "redirect", to: "/dashboard" };
	}

	return { kind: "content" };
};
