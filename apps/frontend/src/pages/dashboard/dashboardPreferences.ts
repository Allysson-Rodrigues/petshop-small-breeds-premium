export const DASHBOARD_PREFERENCES_KEY = "dashboard_preferences";
export const DASHBOARD_PREFERENCES_UPDATED_EVENT =
	"dashboard-preferences-updated";

export interface DashboardPreferences {
	notificationsEnabled: boolean;
	reducedMotion: boolean;
}

const defaultDashboardPreferences: DashboardPreferences = {
	notificationsEnabled: true,
	reducedMotion: false,
};

export function getPreferencesStorageKey(userId?: string): string {
	return userId
		? `${DASHBOARD_PREFERENCES_KEY}:${userId}`
		: DASHBOARD_PREFERENCES_KEY;
}

export function readDashboardPreferences(
	userId?: string,
): DashboardPreferences {
	if (typeof window === "undefined") {
		return defaultDashboardPreferences;
	}

	try {
		const raw = window.localStorage.getItem(getPreferencesStorageKey(userId));

		if (!raw) {
			return defaultDashboardPreferences;
		}

		const parsed = JSON.parse(raw) as Partial<DashboardPreferences>;

		return {
			notificationsEnabled:
				parsed.notificationsEnabled ??
				defaultDashboardPreferences.notificationsEnabled,
			reducedMotion:
				parsed.reducedMotion ?? defaultDashboardPreferences.reducedMotion,
		};
	} catch {
		return defaultDashboardPreferences;
	}
}

export function saveDashboardPreferences(
	userId: string | undefined,
	preferences: DashboardPreferences,
) {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(
		getPreferencesStorageKey(userId),
		JSON.stringify(preferences),
	);
	window.dispatchEvent(
		new CustomEvent(DASHBOARD_PREFERENCES_UPDATED_EVENT, {
			detail: {
				preferences,
				userId,
			},
		}),
	);
}
