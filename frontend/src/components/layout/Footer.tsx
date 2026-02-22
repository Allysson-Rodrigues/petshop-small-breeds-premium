import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Inscribed:", email);
    setEmail("");
    alert("Inscrição realizada com sucesso para receber novidades exclusivas.");
  };

  return (
    <footer className="bg-white border-t border-border-grey pt-24 pb-16 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 mb-20">

          {/* Column 1: Brand & Manifesto (3/12) */}
          <div className="lg:col-span-3 space-y-8">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity text-black inline-block"
              onClick={() => window.scrollTo(0, 0)}
            >
              PETSHOP{" "}
              <span className="font-light text-neutral-400 underline decoration-black underline-offset-4">
                SMALL BREEDS
              </span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed font-light italic">
              "Redefinindo o luxo no cuidado pet. Onde a sofisticação encontra o carinho mais puro, criando experiências inesquecíveis para seu companheiro."
            </p>
          </div>

          {/* Column 2: Navigation (2/12) */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black mb-8">
              Descubra
            </h3>
            <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              <li><Link className="hover:text-black transition-colors hover-underline-magnetic" to="/sobre" onClick={() => window.scrollTo(0, 0)}>Sobre Nós</Link></li>
              <li><Link className="hover:text-black transition-colors hover-underline-magnetic" to="/servicos" onClick={() => window.scrollTo(0, 0)}>Serviços Premium</Link></li>
              <li><Link className="hover:text-black transition-colors hover-underline-magnetic" to="/loja" onClick={() => window.scrollTo(0, 0)}>Loja Exclusiva</Link></li>
              <li><Link className="hover:text-black transition-colors hover-underline-magnetic" to="/galeria" onClick={() => window.scrollTo(0, 0)}>Galeria de Estilo</Link></li>
            </ul>
          </div>

          {/* Column 3: Services (2/12) */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black mb-8">
              Especialidades
            </h3>
            <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              <li>
                <Link
                  className="hover:text-black transition-colors hover-underline-magnetic"
                  to="/servicos#tosa"
                  onClick={() => {
                    if (window.location.pathname === "/servicos") {
                      document.getElementById("tosa")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Estética Canina
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-black transition-colors hover-underline-magnetic"
                  to="/servicos#banho"
                  onClick={() => {
                    if (window.location.pathname === "/servicos") {
                      document.getElementById("banho")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  SPA & Relaxamento
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-black transition-colors hover-underline-magnetic"
                  to="/servicos#veterinario"
                  onClick={() => {
                    if (window.location.pathname === "/servicos") {
                      document.getElementById("veterinario")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Check-up VIP
                </Link>
              </li>
              <li><Link className="hover:text-black transition-colors hover-underline-magnetic" to="/loja" onClick={() => window.scrollTo(0, 0)}>Acessórios de Luxo</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact/Support (2/12) */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black mb-8">
              Atendimento
            </h3>
            <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              <li className="text-black font-black">(11) 99999-9999</li>
              <li className="lowercase tracking-normal text-[12px]">contato@smallbreeds.com</li>
              <li className="pt-2">Seg - Sex: 08h - 20h</li>
              <li>Sáb: 09h - 18h</li>
            </ul>
          </div>

          {/* Column 5: Newsletter (3/12) */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black mb-8">
              Newsletter Exclusiva
            </h3>
            <p className="text-xs text-neutral-500 mb-6 font-light leading-relaxed">
              Receba convites para eventos e novidades da Small Breeds em primeira mão.
            </p>
            <form onSubmit={handleSubscribe} className="relative group">
              <input
                type="email"
                required
                placeholder="Seu e-mail sênior"
                className="w-full bg-neutral-50 border-b border-neutral-200 py-3 pr-10 text-xs font-light tracking-widest placeholder:text-neutral-300 focus:outline-none focus:border-black transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors hover-underline-magnetic"
                aria-label="Inscrever-se"
              >
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </button>
            </form>
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
            <div className="flex gap-8 items-center">
              <a href="#" className="text-neutral-400 hover:text-black transition-all hover-underline-magnetic transform hover:-translate-y-0.5" aria-label="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-black transition-all hover-underline-magnetic transform hover:-translate-y-0.5" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.562.217.96.477 1.382.899.422.422.682.822.899 1.382.163.422.358 1.057.412 2.227.059 1.266.071 1.646.071 4.85s-.012 3.584-.071 4.85c-.054 1.17-.249 1.805-.412 2.227-.217.562-.477.961-.899 1.382-.422.422-.822.682-1.382.899-.422.163-1.057.358-2.227.412-1.266.059-1.646.071-4.85.071s-3.584-.012-4.85-.071c-1.17-.054-1.805-.249-2.227-.412-.562-.217-.961-.477-1.382-.899-.422-.422-.822-.682-.899-1.382-.163-.422-.358-1.057-.412-2.227-.059-1.266-.071-1.646-.071-4.85s.012-3.584.071-4.85c.054-1.17.249-1.805.412-2.227.217-.562.477-.961.899-1.382.422-.422.822-.682 1.382-.899.422-.163 1.057-.358 2.227-.412 1.266-.059 1.646-.071 4.85-.071M12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126s1.337 1.078 2.126 1.384c.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384s1.078-1.337 1.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.148-.558-2.913-.306-.789-.718-1.459-1.384-2.126s-1.337-1.078-2.126-1.384c-.765-.296-1.636-.499-2.913-.558C15.667.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16.4a4.4 4.4 0 110-8.8 4.4 4.4 0 010 8.8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-black transition-all hover-underline-magnetic transform hover:-translate-y-0.5" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
