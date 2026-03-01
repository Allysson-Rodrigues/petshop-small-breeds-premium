import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navLinks = [
  { name: "Serviços", path: "/servicos" },
  { name: "Loja", path: "/loja" },
  { name: "Galeria", path: "/galeria" },
  { name: "Agendamento", path: "/agendamento" },
  { name: "Sobre", path: "/sobre" },
];

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    logout();
    setIsLoggedIn(false);
    navigate("/");
    setIsMobileMenuOpen(false);
    setIsLoggingOut(false);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border-grey bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">

        {/* Logo */}
        <Link
          to="/"
          className="group text-xl font-light tracking-tighter hover:opacity-80 transition-opacity duration-300 text-charcoal shrink-0 flex items-center gap-2"
          onClick={() => window.scrollTo(0, 0)}
        >
          <span className="material-symbols-outlined text-2xl transition-transform group-hover:rotate-12">pets</span>
          <span className="font-display font-light tracking-tight">PETSHOP</span>{" "}
          <span className="font-display font-light italic text-medium-grey underline decoration-charcoal/20 underline-offset-4">
            Small Breeds
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-sans" aria-label="Navegação principal">
          {navLinks.map((link, i) => {
            const isActive = link.path === "/" ? location.pathname === "/" : location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  relative text-[10px] font-medium uppercase tracking-[0.3em] transition-colors duration-300
                  hover:text-black group
                  ${isActive ? "text-black" : "text-medium-grey"}
                `}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link.name}
                {/* Animated underline */}
                <span
                  className={`
                    absolute -bottom-2 left-0 h-[1.5px] bg-black transition-[width] duration-500 ease-out
                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-6 shrink-0">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="hover-underline-magnetic text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal"
              >
                Painel
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center justify-center bg-black text-white px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors duration-300 shadow-sm disabled:opacity-50"
              >
                {isLoggingOut ? "Saindo..." : "Sair"}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover-underline-magnetic text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal"
              >
                Entrar
              </Link>
              <Link
                to="/agendamento"
                className="inline-flex items-center justify-center bg-black text-white px-8 py-3 text-[10px] font-medium uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors duration-300 shadow-sm"
              >
                Reservar
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-charcoal"
          aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="material-symbols-outlined text-2xl">
            {isMobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out
          ${isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
          bg-white border-b border-border-grey shadow-lg
        `}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className="px-6 py-6 flex flex-col gap-1" aria-label="Menu mobile">
          {navLinks.map((link, i) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  flex items-center justify-between py-3 text-sm font-medium uppercase tracking-widest
                  border-b border-border-grey last:border-none transition-colors duration-200
                  ${isActive ? "text-black" : "text-charcoal hover:text-black"}
                `}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${i * 50}ms` : "0ms",
                  transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-8px)",
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transition: `color 200ms, opacity 400ms ${i * 50}ms, transform 400ms ${i * 50}ms`,
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
                {isActive && (
                  <span className="material-symbols-outlined text-base">
                    chevron_right
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4">
            {isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center bg-black px-6 py-4 text-sm font-medium uppercase tracking-widest text-white primary-cta"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center justify-center border border-charcoal px-6 py-4 text-sm font-medium uppercase tracking-widest text-charcoal disabled:opacity-50"
                >
                  {isLoggingOut ? "Saindo..." : "Sair"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="flex items-center justify-center border border-charcoal px-6 py-4 text-sm font-medium uppercase tracking-widest text-charcoal"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  to="/agendamento"
                  className="flex items-center justify-center bg-black px-6 py-4 text-sm font-medium uppercase tracking-widest text-white primary-cta"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Agendar Horário
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
