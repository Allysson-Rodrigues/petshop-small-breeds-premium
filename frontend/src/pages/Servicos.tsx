import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Servicos() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);
  // SEO: <title>Serviços Premium | Small Breeds</title>
  // <meta name="description" content="Tosa artesanal, banho de luxo e cuidados veterinários dedicados exclusivamente para cães de raças pequenas." />
  // <meta property="og:title" content="Experiência Sênior para Pets - Small Breeds" />
  // <meta property="og:description" content="Cuidado artesanal com infraestrutura de luxo." />
  // <meta name="keywords" content="tosa artisanal, banho luxo sampa, veterinário especializado raças pequenas" />
  return (
    <div className="flex flex-col min-h-screen font-display bg-background-light text-charcoal">
      {/* Hero Section */}
      <section className="relative bg-white pt-32 pb-20 border-b border-border-grey">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-medium-grey mb-4">
            Cuidado Profissional
          </h2>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-6">
            Nossos Serviços Premium
          </h1>
          <p className="text-lg text-medium-grey max-w-2xl mx-auto font-light leading-relaxed">
            Experimente serviços premium de banho e tosa e cuidados
            veterinários, adaptados às necessidades únicas do seu pet em um
            ambiente sofisticado e minimalista.
          </p>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-1 md:grid-cols-3">
            <div id="tosa" className="group border border-border-grey bg-white p-12 transition-all hover:bg-neutral-50 shadow-sm">
              <div className="mb-10 text-charcoal">
                <span className="material-symbols-outlined text-5xl font-light">
                  cut
                </span>
              </div>
              <h4 className="mb-5 text-xl font-black uppercase tracking-tight text-charcoal">
                Tosa Artesanal
              </h4>
              <p className="text-medium-grey leading-relaxed font-light">
                Cortes precisos e estilos adaptados aos padrões específicos da
                raça do seu pet, garantindo um visual elegante e confortável.
              </p>
            </div>
            <div id="banho" className="group border border-border-grey bg-white p-12 transition-all hover:bg-neutral-50 shadow-sm">
              <div className="mb-10 text-charcoal">
                <span className="material-symbols-outlined text-5xl font-light">
                  bathtub
                </span>
              </div>
              <h4 className="mb-5 text-xl font-black uppercase tracking-tight text-charcoal">
                Banho de Luxo
              </h4>
              <p className="text-medium-grey leading-relaxed font-light">
                Banhos relaxantes com shampoos e condicionadores premium
                hipoalergênicos seguidos de secagem suave e escovação.
              </p>
            </div>
            <div id="veterinario" className="group border border-border-grey bg-white p-12 transition-all hover:bg-neutral-50 shadow-sm">
              <div className="mb-10 text-charcoal">
                <span className="material-symbols-outlined text-5xl font-light">
                  medical_services
                </span>
              </div>
              <h4 className="mb-5 text-xl font-black uppercase tracking-tight text-charcoal">
                Cuidados Veterinários
              </h4>
              <p className="text-medium-grey leading-relaxed font-light">
                Check-ups completos de saúde, vacinações e tratamentos dos
                nossos veterinários certificados.
              </p>
            </div>
          </div>

          <div className="mt-20 text-center">
            <Link
              to="/agendamento"
              className="inline-flex items-center justify-center bg-black px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all btn-magnetic focus:outline-none"
            >
              Agendar um Atendimento
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
