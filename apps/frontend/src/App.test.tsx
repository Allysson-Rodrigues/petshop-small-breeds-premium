import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App Component", () => {
  it("renders PetShop Small Breeds title", () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
    const titleElements = screen.getAllByText(/PETSHOP/i);
    expect(titleElements.length).toBeGreaterThan(0);
  });

  it("renders Hero section text", () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
    expect(screen.getByText(/Seu Melhor Amigo/i)).toBeInTheDocument();
  });
});
