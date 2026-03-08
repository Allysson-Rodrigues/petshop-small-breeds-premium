import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import App from "./App";

const appSource = readFileSync("./src/App.tsx", "utf8");
const homeSource = readFileSync("./src/pages/Home.tsx", "utf8");

describe("App module smoke tests", () => {
	it("exports the main application component", () => {
		expect(typeof App).toBe("function");
	});

	it("keeps the public catalog and gallery routes wired", () => {
		expect(appSource).toContain('path="/loja"');
		expect(appSource).toContain('path="/galeria"');
		expect(appSource).toContain('path="/galeria/:slug"');
	});

	it("preserves the public home hero and services content", () => {
		expect(homeSource).toContain("Para seu melhor amigo");
		expect(homeSource).toContain("Nossos Serviços Premium");
	});
});
