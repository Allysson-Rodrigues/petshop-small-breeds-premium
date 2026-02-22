import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Main Application Routes that need the Header */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/loja" element={<Catalogo />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/agendamento" element={<Agendamento />} />
          <Route path="/galeria/:slug" element={<RacaCuidados />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
