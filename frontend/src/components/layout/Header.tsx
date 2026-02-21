import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("auth_token"),
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-grey bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity text-charcoal"
            onClick={() => window.scrollTo(0, 0)}
          >
            PETSHOP{" "}
            <span className="font-light text-medium-grey underline decoration-charcoal underline-offset-4">
              SMALL BREEDS
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-10">
          <Link
            className="text-xs font-bold uppercase tracking-widest text-charcoal hover:text-black transition-colors"
            to="/servicos"
          >
            Serviços
          </Link>
          <Link
            className="text-xs font-bold uppercase tracking-widest text-charcoal hover:text-black transition-colors"
            to="/agendamento"
          >
            Agendamento
          </Link>
          <Link
            className="text-xs font-bold uppercase tracking-widest text-charcoal hover:text-black transition-colors"
            to="/loja"
          >
            Loja
          </Link>
          <Link
            className="text-xs font-bold uppercase tracking-widest text-charcoal hover:text-black transition-colors"
            to="/sobre"
          >
            Sobre
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="hidden md:flex items-center justify-center border border-charcoal bg-charcoal text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center justify-center border border-charcoal px-6 py-2 text-xs font-bold uppercase tracking-widest text-charcoal hover:bg-neutral-100 transition-all"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center justify-center border border-charcoal px-6 py-2 text-xs font-bold uppercase tracking-widest text-charcoal hover:bg-charcoal hover:text-white transition-all"
            >
              Entrar
            </Link>
          )}
          <button
            className="md:hidden p-2 text-charcoal"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-border-grey px-4 py-6 flex flex-col gap-6 shadow-xl">
          <Link
            className="text-sm font-bold uppercase tracking-widest text-charcoal border-b border-border-grey pb-4"
            to="/servicos"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Serviços
          </Link>
          <Link
            className="text-sm font-bold uppercase tracking-widest text-charcoal border-b border-border-grey pb-4"
            to="/agendamento"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Agendamento
          </Link>
          <Link
            className="text-sm font-bold uppercase tracking-widest text-charcoal border-b border-border-grey pb-4"
            to="/loja"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Loja
          </Link>
          <Link
            className="text-sm font-bold uppercase tracking-widest text-charcoal border-b border-border-grey pb-4"
            to="/sobre"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sobre
          </Link>

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="flex items-center justify-center bg-black px-6 py-4 text-sm font-bold uppercase tracking-widest text-white mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Entrar
            </Link>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="flex items-center justify-center bg-black px-6 py-4 text-sm font-bold uppercase tracking-widest text-white mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center border border-charcoal px-6 py-4 text-sm font-bold uppercase tracking-widest text-charcoal mt-2"
              >
                Sair
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
