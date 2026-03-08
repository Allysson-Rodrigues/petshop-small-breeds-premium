import React, { useRef, useState } from "react";
import { Helmet } from "../components/seo/HelmetCompat";
import RevealSection from "../components/ui/RevealSection";

export default function Agendamento() {
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setShowSuccess(true);
      formRef.current?.reset();
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-charcoal flex flex-col">
      <Helmet>
        <title>Agendamento | Small Breeds</title>
        <meta name="description" content="Reserve um horário exclusivo para seu pet de raça pequena. Atendimento premium com conforto e atenção total." />
        <meta property="og:title" content="Agendamento — Small Breeds" />
      </Helmet>

      <section className="bg-light-grey pt-32 pb-20 border-b border-border-grey">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <RevealSection>
            <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-medium-grey mb-4">
              Concierge
            </h2>
            <h1 className="text-4xl md:text-5xl font-display font-light tracking-tight text-black mb-6">
              Agendamento Exclusivo
            </h1>
            <p className="text-lg text-medium-grey font-light leading-relaxed">
              Reserve um momento de cuidado premium para seu cão de pequeno porte.
              Nossos horários são desenhados para garantir que seu companheiro
              receba atenção total, sem pressa e com o máximo de conforto.
            </p>
          </RevealSection>
        </div>
      </section>

      <section className="py-20 px-6 max-w-3xl mx-auto w-full flex-1">
        {showSuccess && (
          <div className="mb-10 bg-black text-white p-6 border border-neutral-800 text-center flex flex-col items-center gap-4 animate-fade-in">
            <span className="material-symbols-outlined text-4xl font-light">
              check_circle
            </span>
            <div>
              <h3 className="text-lg font-medium tracking-tight mb-1">
                Reserva Solicitada
              </h3>
              <p className="text-sm font-light text-neutral-400">
                Nossa equipe de concierge avaliará a disponibilidade e entrará
                em contato em até 24h para confirmar os detalhes do seu
                atendimento.
              </p>
            </div>
          </div>
        )}

        <form ref={formRef} className="space-y-10" onSubmit={handleFormSubmit}>
          <RevealSection>
            <div className="border-b border-border-grey pb-10">
              <h3 className="text-lg font-medium tracking-tight text-black mb-8 border-l-2 border-black pl-3">
                Informações do Companheiro
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label htmlFor="petName" className="block text-[10px] font-bold text-medium-grey uppercase tracking-widest">
                    Nome do Pet
                  </label>
                  <input
                    id="petName"
                    type="text"
                    placeholder="Ex: Duque"
                    className="w-full bg-transparent border-b border-medium-grey/40 py-3 text-black focus:border-black focus:outline-none focus-visible:ring-1 focus-visible:ring-black transition-colors placeholder:text-neutral-300"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="petBreed" className="block text-[10px] font-bold text-medium-grey uppercase tracking-widest">
                    Raça
                  </label>
                  <input
                    id="petBreed"
                    type="text"
                    placeholder="Ex: Yorkshire Terrier"
                    className="w-full bg-transparent border-b border-medium-grey/40 py-3 text-black focus:border-black focus:outline-none focus-visible:ring-1 focus-visible:ring-black transition-colors placeholder:text-neutral-300"
                    required
                  />
                </div>
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={100}>
            <div className="border-b border-border-grey pb-10">
              <h3 className="text-lg font-medium tracking-tight text-black mb-8 border-l-2 border-black pl-3">
                Detalhes do Serviço
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 md:col-span-2">
                  <label htmlFor="serviceType" className="block text-[10px] font-bold text-medium-grey uppercase tracking-widest">
                    Serviço Desejado
                  </label>
                  <div className="relative">
                    <select id="serviceType" className="w-full bg-transparent border-b border-medium-grey/40 py-3 text-black focus:border-black outline-none transition-colors appearance-none cursor-pointer">
                      <option value="">Selecione um pacote de cuidado...</option>
                      <option value="banho">Banho de Luxo com Cromoterapia</option>
                      <option value="tosa_artesanal">Tosa Artesanal na Tesoura</option>
                      <option value="spa">Spa Day Completo (Banho, Tosa e Ozonioterapia)</option>
                      <option value="vet">Consulta Veterinária Preventiva</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-0 top-3 text-medium-grey pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label htmlFor="preferredDate" className="block text-[10px] font-bold text-medium-grey uppercase tracking-widest">
                    Data Preferida
                  </label>
                  <input
                    id="preferredDate"
                    type="date"
                    className="w-full bg-transparent border-b border-medium-grey/40 py-3 text-black focus:border-black focus:outline-none focus-visible:ring-1 focus-visible:ring-black transition-colors"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="preferredPeriod" className="block text-[10px] font-bold text-medium-grey uppercase tracking-widest">
                    Período
                  </label>
                  <div className="relative">
                    <select
                      id="preferredPeriod"
                      className="w-full bg-transparent border-b border-medium-grey/40 py-3 text-black focus:border-black focus:outline-none focus-visible:ring-1 focus-visible:ring-black transition-colors appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Selecione o turno...</option>
                      <option value="manha">Manhã (09h - 12h)</option>
                      <option value="tarde">Tarde (13h - 18h)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-0 top-3 text-medium-grey pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={200}>
            <div className="pt-8">
              <button
                type="submit"
                disabled={submitting}
                className={`w-full text-white py-5 text-xs font-medium uppercase tracking-[0.2em] transition-colors flex justify-center items-center gap-3 ${submitting ? "bg-black opacity-70 cursor-wait" : "bg-black border border-charcoal btn-magnetic"}`}
                aria-busy={submitting}
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">
                      autorenew
                    </span>
                    Processando Solicitação...
                  </>
                ) : (
                  "Confirmar Solicitação de Reserva"
                )}
              </button>
              <p className="text-[10px] text-center text-medium-grey mt-6 uppercase tracking-widest font-bold">
                *Atendimentos sujeitos à aprovação da diretoria clínica.
              </p>
            </div>
          </RevealSection>
        </form>
      </section>
    </div>
  );
}
