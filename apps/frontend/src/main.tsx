import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "./components/seo/HelmetCompat";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
);
