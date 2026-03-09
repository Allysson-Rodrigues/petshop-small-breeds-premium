import { readFileSync } from "node:fs";
import {
	DashboardCollectionPanel,
	DashboardFormField,
	DashboardFormGrid,
	DashboardInlineForm,
	dashboardInputClassName,
	dashboardSelectClassName,
} from "./DashboardForm";

const dashboardFormSource = readFileSync(
	"./src/pages/dashboard/components/DashboardForm.tsx",
	"utf8",
);

describe("DashboardForm module", () => {
	it("exporta a base reutilizavel do dashboard", () => {
		expect(typeof DashboardCollectionPanel).toBe("function");
		expect(typeof DashboardFormField).toBe("function");
		expect(typeof DashboardFormGrid).toBe("function");
		expect(typeof DashboardInlineForm).toBe("function");
	});

	it("centraliza os estilos compartilhados dos controles", () => {
		expect(dashboardInputClassName).toContain("focus:border-primary");
		expect(dashboardInputClassName).toContain("bg-gray-50/30");
		expect(dashboardSelectClassName).toContain("focus:border-primary");
		expect(dashboardSelectClassName).toContain("bg-white");
	});

	it("mantem a estrutura compartilhada do painel e das acoes do formulario", () => {
		expect(dashboardFormSource).toContain("overflow-hidden");
		expect(dashboardFormSource).toContain("border-primary/20 shadow-md");
		expect(dashboardFormSource).toContain('title="Fechar"');
		expect(dashboardFormSource).toContain("Cancelar");
	});
});
