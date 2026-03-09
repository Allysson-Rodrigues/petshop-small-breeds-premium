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

	it("mantem a coluna lateral compacta sem scroll interno na atividade", () => {
		expect(overviewSource).toContain("items-start gap-6 xl:grid-cols-3");
		expect(overviewSource).toContain('Ver mais {hiddenRecentActivityCount} evento(s) na agenda');
		expect(overviewSource).not.toContain("flex h-full flex-col justify-between");
		expect(overviewSource).not.toContain("max-h-80 space-y-2 overflow-y-auto pr-1");
	});
});
