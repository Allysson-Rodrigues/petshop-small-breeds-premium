import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import PageTransition from "./components/ui/PageTransition";
import MainLayout from "./MainLayout";
import Agendamento from "./pages/Agendamento";
import Catalogo from "./pages/Catalogo";
import Dashboard from "./pages/Dashboard";
import Galeria from "./pages/Galeria";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RacaCuidados from "./pages/RacaCuidados";
import Registro from "./pages/Registro";
import Servicos from "./pages/Servicos";
import Sobre from "./pages/Sobre";

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
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          <PageTransition withSlide={false}><Login /></PageTransition>
        } />
        <Route path="/registro" element={
          <PageTransition withSlide={false}><Registro /></PageTransition>
        } />
        <Route path="/dashboard" element={
          <PageTransition withSlide={false}><Dashboard /></PageTransition>
        } />
        <Route element={<MainLayout />}>
          <Route path="/" element={
            <PageTransition><Home /></PageTransition>
          } />
          <Route path="/loja" element={
            <PageTransition><Catalogo /></PageTransition>
          } />
          <Route path="/sobre" element={
            <PageTransition><Sobre /></PageTransition>
          } />
          <Route path="/servicos" element={
            <PageTransition><Servicos /></PageTransition>
          } />
          <Route path="/catalogo" element={
            <PageTransition><Catalogo /></PageTransition>
          } />
          <Route path="/galeria" element={
            <PageTransition><Galeria /></PageTransition>
          } />
          <Route path="/agendamento" element={
            <PageTransition><Agendamento /></PageTransition>
          } />
          <Route path="/galeria/:slug" element={
            <PageTransition><RacaCuidados /></PageTransition>
          } />
        </Route>
      </Routes>
    </AnimatePresence>
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
