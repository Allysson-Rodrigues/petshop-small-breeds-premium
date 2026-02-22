import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal-up ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col font-display bg-background-light text-charcoal">
      <Helmet>
        <title>Small Breeds | Luxo e Cuidado para seu Pet</title>
        <meta name="description" content="O destino definitivo de luxo para seu pet de raça pequena. Banho, tosa artesanal e cuidados veterinários premium em São Paulo." />
        <meta property="og:title" content="Small Breeds — Heritage of Care" />
        <meta property="og:description" content="Redefinindo o luxo pet com estética minimalista e cuidado sênior." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ═══════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════ */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="relative overflow-hidden">
            <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-0">
              <div className="relative z-10 py-12 lg:pr-12 animate-fade-in">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-medium-grey mb-6">
                  Exclusivo para Raças Pequenas
                </p>
                <h1 className="font-display text-5xl font-black leading-[1.1] tracking-tight text-black sm:text-6xl lg:text-7xl mb-8">
                  Cuidado Elevado para <br />
                  <span className="text-medium-grey">Seu Melhor Amigo</span>
                </h1>
                <p className="mb-10 max-w-lg text-lg text-charcoal font-light leading-relaxed">
                  Experimente serviços premium de banho e tosa e cuidados
                  veterinários, adaptados às necessidades únicas do seu pet em
                  um ambiente sofisticado e minimalista.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/agendamento"
                    className="inline-flex items-center justify-center bg-black px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all btn-magnetic"
                  >
                    Agendar Horário
                  </Link>
                  <Link
                    to="/servicos"
                    className="inline-flex items-center justify-center border border-charcoal px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal transition-all btn-magnetic"
                  >
                    Ver Serviços
                  </Link>
                </div>
              </div>
              <div className="relative h-[500px] lg:h-[700px] overflow-hidden">
                <img
                  alt="Golden retriever sentado calmamente em uma sala de estar moderna"
                  className="h-full w-full object-cover grayscale brightness-90 contrast-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg8Ot3selgR8zBD6NMO_ycoO-MmjeW7VGB6jKq5dVbxExUlPCUut_IPbQzlqUQZ2Bd4VuI6ibh6YCHs3tzaoDpmhAUyLaRM_FFxCDz7LroBiW_79fNaWaLbPR9hYjV1SzcqyOQXIx-lcSy6AoKT9BN4XHiKcvfwqjB30H4WlzQHGiIJtsSO1NlzZeOuxN6XGV5AMY8JBN3TNS0Md9rASirZ4UIg69EC_WqoP4NuvdIG_1sV5quwqI-8BRILacyyX1HAGrn1v7Q6KM"
                />
                <div className="absolute inset-0 bg-black/5"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — SOCIAL PROOF (NÚMEROS)
      ═══════════════════════════════════════════ */}
      <section className="bg-black text-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-black tracking-tight mb-2">2.400+</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">Pets Atendidos</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-black tracking-tight mb-2">5</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">Anos de Experiência</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-black tracking-tight mb-2">4.9★</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">Avaliação Google</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-black tracking-tight mb-2">98%</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">Clientes Fiéis</span>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 — SERVIÇOS PREMIUM
      ═══════════════════════════════════════════ */}
      <section className="bg-white py-24" id="services">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="mb-20">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-medium-grey">
                Cuidado Profissional
              </h2>
              <h3 className="mt-4 text-4xl font-black tracking-tight text-black sm:text-5xl">
                Nossos Serviços Premium
              </h3>
              <div className="mt-6 h-1 w-20 bg-black"></div>
            </div>
          </RevealSection>
          <div className="grid gap-1 md:grid-cols-3">
            {[
              {
                icon: "cut",
                title: "Tosa Artesanal",
                desc: "Cortes precisos e estilos adaptados aos padrões específicos da raça do seu pet, garantindo um visual elegante e confortável.",
                price: "R$ 89",
                link: "/servicos#tosa",
              },
              {
                icon: "bathtub",
                title: "Banho de Luxo",
                desc: "Banhos relaxantes com shampoos e condicionadores premium hipoalergênicos seguidos de secagem suave e escovação.",
                price: "R$ 65",
                link: "/servicos#banho",
              },
              {
                icon: "medical_services",
                title: "Cuidados Veterinários",
                desc: "Check-ups completos de saúde, vacinações e tratamentos dos nossos veterinários certificados.",
                price: "R$ 120",
                link: "/servicos#veterinario",
              },
            ].map((svc) => (
              <RevealSection key={svc.title}>
                <Link
                  to={svc.link}
                  className="group border border-border-grey bg-white p-12 transition-all hover:bg-neutral-50 flex flex-col h-full"
                >
                  <div className="mb-10 text-charcoal">
                    <span className="material-symbols-outlined text-5xl font-light">
                      {svc.icon}
                    </span>
                  </div>
                  <h4 className="mb-5 text-xl font-black uppercase tracking-tight text-charcoal">
                    {svc.title}
                  </h4>
                  <p className="text-medium-grey leading-relaxed font-light flex-1">
                    {svc.desc}
                  </p>
                  <div className="mt-8 pt-6 border-t border-border-grey flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-medium-grey">
                      A partir de
                    </span>
                    <span className="text-2xl font-black text-black tracking-tight">
                      {svc.price}
                    </span>
                  </div>
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4 — DEPOIMENTOS
      ═══════════════════════════════════════════ */}
      <section className="bg-neutral-50 py-24 border-y border-border-grey">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="mb-20 text-center">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-medium-grey mb-4">
                O que dizem nossos clientes
              </h2>
              <h3 className="text-4xl font-black tracking-tight text-black sm:text-5xl">
                Confiança Construída com Carinho
              </h3>
            </div>
          </RevealSection>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Maria S.",
                pet: "Luna — Yorkshire",
                text: "Minha Luna adora vir aqui! A equipe é extremamente cuidadosa e a tosa ficou impecável. Não troco por nada.",
                rating: 5,
              },
              {
                name: "Carlos R.",
                pet: "Thor — Shih Tzu",
                text: "O Thor tem medo de banho, mas aqui ele fica tranquilo. O ambiente é calmo e o atendimento é de primeiro mundo.",
                rating: 5,
              },
              {
                name: "Ana P.",
                pet: "Mel — Poodle",
                text: "Faz 3 anos que trago a Mel. A Dra. veterinária é incrível e sempre explica tudo com paciência. Recomendo de olhos fechados.",
                rating: 5,
              },
            ].map((t) => (
              <RevealSection key={t.name}>
                <div className="bg-white p-10 border border-border-grey h-full flex flex-col">
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-black text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-charcoal leading-relaxed font-light italic flex-1 mb-8">
                    "{t.text}"
                  </p>
                  <div className="border-t border-border-grey pt-6">
                    <p className="font-bold text-sm text-black">{t.name}</p>
                    <p className="text-xs text-medium-grey font-light mt-1">{t.pet}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5 — CTA FINAL
      ═══════════════════════════════════════════ */}
      <section className="bg-black text-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <RevealSection>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              Pronto para Conhecer?
            </h2>
            <p className="text-lg text-neutral-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
              Agende uma visita e descubra por que somos o destino preferido de
              mais de 2.400 pets em São Paulo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/agendamento"
                className="inline-flex items-center justify-center bg-white text-black px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-neutral-200"
              >
                Agendar Horário
              </Link>
              <a
                href="tel:+5511999999999"
                className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                (11) 99999-9999
              </a>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
