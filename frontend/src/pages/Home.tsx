import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col font-display bg-background-light text-charcoal">
      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="relative overflow-hidden">
            <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-0">
              <div className="relative z-10 py-12 lg:pr-12">
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
                    className="inline-flex items-center justify-center bg-black px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-neutral-800 focus:outline-none"
                  >
                    Agendar Horário
                  </Link>
                  <Link
                    to="/servicos"
                    className="inline-flex items-center justify-center border border-charcoal px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal transition-all hover:bg-light-grey"
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

      <section className="bg-white py-24" id="services">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-medium-grey">
              Cuidado Profissional
            </h2>
            <h3 className="mt-4 text-4xl font-black tracking-tight text-black sm:text-5xl">
              Nossos Serviços Premium
            </h3>
            <div className="mt-6 h-1 w-20 bg-black"></div>
          </div>
          <div className="grid gap-1 md:grid-cols-3">
            <div className="group border border-border-grey bg-white p-12 transition-all hover:bg-neutral-50">
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
            <div className="group border border-border-grey bg-white p-12 transition-all hover:bg-neutral-50">
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
            <div className="group border border-border-grey bg-white p-12 transition-all hover:bg-neutral-50">
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
        </div>
      </section>
    </div>
  );
}
