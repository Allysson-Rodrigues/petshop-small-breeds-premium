import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { name: "Serviços", path: "/servicos" },
  { name: "Loja", path: "/loja" },
  { name: "Galeria", path: "/galeria" },
  { name: "Agendamento", path: "/agendamento" },
  { name: "Sobre", path: "/sobre" },
];

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("auth_token"),
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-grey bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity duration-300 text-charcoal shrink-0"
          onClick={() => window.scrollTo(0, 0)}
        >
          PETSHOP{" "}
          <span className="font-light text-medium-grey underline decoration-charcoal underline-offset-4">
            SMALL BREEDS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Navegação principal">
          {navLinks.map((link, i) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  relative text-xs font-bold uppercase tracking-widest transition-colors duration-300
                  hover:text-black group
                  ${isActive ? "text-black" : "text-charcoal"}
                `}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link.name}
                {/* Animated underline */}
                <span
                  className={`
                    absolute -bottom-1 left-0 h-[1.5px] bg-black transition-all duration-500 ease-out
                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center border border-charcoal bg-charcoal text-white px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black transition-all duration-300 primary-cta"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center border border-charcoal px-5 py-2 text-xs font-bold uppercase tracking-widest text-charcoal hover:bg-neutral-100 transition-all duration-300"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/agendamento"
              className="inline-flex items-center justify-center bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all duration-300 primary-cta"
            >
              Agendar
            </Link>
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
          md:hidden overflow-hidden transition-all duration-500 ease-in-out
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
                  flex items-center justify-between py-3 text-sm font-bold uppercase tracking-widest
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
                  className="flex items-center justify-center bg-black px-6 py-4 text-sm font-bold uppercase tracking-widest text-white primary-cta"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center border border-charcoal px-6 py-4 text-sm font-bold uppercase tracking-widest text-charcoal"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                to="/agendamento"
                className="flex items-center justify-center bg-black px-6 py-4 text-sm font-bold uppercase tracking-widest text-white primary-cta"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Agendar Horário
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
