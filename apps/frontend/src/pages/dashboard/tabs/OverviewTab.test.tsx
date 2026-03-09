import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const overviewSource = readFileSync(
	"./src/pages/dashboard/tabs/OverviewTab.tsx",
	"utf8",
);

describe("OverviewTab source", () => {
	it("exibe metricas reais e historico operacional para admin", () => {
		expect(overviewSource).toContain("Indicadores operacionais");
		expect(overviewSource).toContain("Histórico operacional");
		expect(overviewSource).toContain("Atividade recente");
		expect(overviewSource).toContain("Estoque em atenção");
	});

	it("remove o placeholder anterior de relatorios", () => {
		expect(overviewSource).not.toContain("Relatórios em breve.");
	});
});
