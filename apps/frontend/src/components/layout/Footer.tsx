import { Link } from "react-router-dom";

export default function Footer() {

  return (
    <footer
      className="bg-white border-t border-border-grey pt-24 pb-16 mt-auto"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 mb-20">

          {/* Column 1: Brand & Manifesto */}
          <div className="lg:col-span-12 flex flex-col items-center justify-center space-y-4 text-center">
            <Link
              to="/"
              className="text-2xl font-light tracking-tighter hover:opacity-80 transition-opacity text-black inline-flex items-center gap-2"
              onClick={() => window.scrollTo(0, 0)}
            >
              <span className="material-symbols-outlined text-2xl">pets</span>
              PETSHOP{" "}
              <span className="font-light text-neutral-400 underline decoration-black underline-offset-4">
                SMALL BREEDS
              </span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed font-light italic max-w-xl">
              "Redefinindo o luxo no cuidado pet. Onde a sofisticação encontra o carinho mais puro, criando experiências inesquecíveis para seu companheiro."
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Location & Socials */}
        <div className="flex flex-col lg:flex-row items-center justify-between border-t border-neutral-100 pt-10 gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8 text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase">
            <p>© 2026 Petshop Small Breeds. Heritage of Care.</p>
            <span className="hidden md:block w-1 h-1 bg-neutral-200 rounded-full"></span>
            <p>Itaim Bibi, São Paulo</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-neutral-100 rounded-lg opacity-60 hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-sm text-neutral-400">verified</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">SSL Secure</span>
            </div>
            <div className="flex gap-6 items-center text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              <Link to="/agendamento" className="hover:text-black transition-colors hover-underline-magnetic">
                Agendamento
              </Link>
              <Link to="/sobre" className="hover:text-black transition-colors hover-underline-magnetic">
                Sobre
              </Link>
              <Link to="/login" className="hover:text-black transition-colors hover-underline-magnetic">
                Painel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
