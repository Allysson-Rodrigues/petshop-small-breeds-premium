import { readFileSync } from "node:fs";
import Dashboard from "./Dashboard";

const dashboardSource = readFileSync("./src/pages/Dashboard.tsx", "utf8");

describe("Dashboard module", () => {
	it("exporta a pagina do painel", () => {
		expect(typeof Dashboard).toBe("function");
	});

	it("mantem lazy loading das tabs administrativas e operacionais", () => {
		expect(dashboardSource).toContain(
			'lazy(() => import("./dashboard/tabs/OverviewTab"))',
		);
		expect(dashboardSource).toContain(
			'lazy(() => import("./dashboard/tabs/ClientsTab"))',
		);
		expect(dashboardSource).toContain(
			'lazy(() => import("./dashboard/tabs/PetsTab"))',
		);
		expect(dashboardSource).toContain(
			'lazy(() => import("./dashboard/tabs/AppointmentsTab"))',
		);
		expect(dashboardSource).toContain(
			'lazy(() => import("./dashboard/tabs/InventoryTab"))',
		);
		expect(dashboardSource).toContain(
			'lazy(() => import("./dashboard/tabs/SettingsTab"))',
		);
	});

	it("preserva um fallback local durante o carregamento das tabs", () => {
		expect(dashboardSource).toContain("<Suspense fallback={<DashboardTabFallback");
		expect(dashboardSource).toContain("Carregando ");
	});
});
