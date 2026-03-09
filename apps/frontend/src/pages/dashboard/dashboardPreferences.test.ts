import {
	DASHBOARD_PREFERENCES_UPDATED_EVENT,
	getPreferencesStorageKey,
	readDashboardPreferences,
	saveDashboardPreferences,
} from "./dashboardPreferences";

describe("dashboardPreferences", () => {
	it("retorna valores padrao quando nao existe preferencia salva", () => {
		expect(readDashboardPreferences("user-1")).toEqual({
			notificationsEnabled: true,
			reducedMotion: false,
		});
	});

	it("persiste as preferencias por usuario e dispara evento de sincronizacao", () => {
		const listener = vi.fn();

		window.addEventListener(
			DASHBOARD_PREFERENCES_UPDATED_EVENT,
			listener as EventListener,
		);

		saveDashboardPreferences("user-1", {
			notificationsEnabled: false,
			reducedMotion: true,
		});

		expect(
			window.localStorage.getItem(getPreferencesStorageKey("user-1")),
		).toBe('{"notificationsEnabled":false,"reducedMotion":true}');
		expect(readDashboardPreferences("user-1")).toEqual({
			notificationsEnabled: false,
			reducedMotion: true,
		});
		expect(listener).toHaveBeenCalledTimes(1);

		window.removeEventListener(
			DASHBOARD_PREFERENCES_UPDATED_EVENT,
			listener as EventListener,
		);
	});
});
