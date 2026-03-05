import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it } from "vitest";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

describe("App Component", () => {
  it("renders PetShop Small Breeds title", async () => {
    render(
      <HelmetProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HelmetProvider>
    );
    const titleElements = await screen.findAllByText(/PETSHOP/i);
    expect(titleElements.length).toBeGreaterThan(0);
  });

  it("renders Hero section text", async () => {
    render(
      <HelmetProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HelmetProvider>
    );
    expect(await screen.findByText(/Para seu melhor amigo/i)).toBeInTheDocument();
  });
});
