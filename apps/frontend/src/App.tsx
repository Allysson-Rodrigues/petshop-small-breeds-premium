import { AnimatePresence } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import GuestOnlyRoute from "./components/auth/GuestOnlyRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PageTransition from "./components/ui/PageTransition";
import MainLayout from "./MainLayout";

const Agendamento = lazy(() => import("./pages/Agendamento"));
const Catalogo = lazy(() => import("./pages/Catalogo"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Galeria = lazy(() => import("./pages/Galeria"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const RacaCuidados = lazy(() => import("./pages/RacaCuidados"));
const Registro = lazy(() => import("./pages/Registro"));
const Servicos = lazy(() => import("./pages/Servicos"));
const Sobre = lazy(() => import("./pages/Sobre"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-medium-grey">
          Carregando página...
        </div>
      }
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/login"
            element={
              <GuestOnlyRoute>
                <PageTransition withSlide={false}>
                  <Login />
                </PageTransition>
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/registro"
            element={
              <GuestOnlyRoute>
                <PageTransition withSlide={false}>
                  <Registro />
                </PageTransition>
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageTransition withSlide={false}>
                  <Dashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/loja"
              element={
                <PageTransition>
                  <Catalogo />
                </PageTransition>
              }
            />
            <Route
              path="/sobre"
              element={
                <PageTransition>
                  <Sobre />
                </PageTransition>
              }
            />
            <Route
              path="/servicos"
              element={
                <PageTransition>
                  <Servicos />
                </PageTransition>
              }
            />

            <Route
              path="/galeria"
              element={
                <PageTransition>
                  <Galeria />
                </PageTransition>
              }
            />
            <Route
              path="/agendamento"
              element={
                <PageTransition>
                  <Agendamento />
                </PageTransition>
              }
            />
            <Route
              path="/galeria/:slug"
              element={
                <PageTransition>
                  <RacaCuidados />
                </PageTransition>
              }
            />
          </Route>
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>

      <ScrollToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
