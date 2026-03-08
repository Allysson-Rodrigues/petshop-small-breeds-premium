import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import RevealSection from "../components/ui/RevealSection";

const breeds = [
  {
    name: "Poodle Toy",
    slug: "poodle-toy",
    desc: "Altamente inteligente e extremamente leal, possui uma pelagem que requer cuidados de tosa artesanal constantes para manter o alto padrão estético.",
    type: "COMPANHIA",
    image: "/breeds/poodle.png",
  },
  {
    name: "Chihuahua",
    slug: "chihuahua",
    desc: "O menor cão do mundo carrega a maior personalidade. Requer atenção especial à temperatura e produtos delicados e hipoalergênicos no banho.",
    type: "VALENTE",
    image: "/breeds/chihuahua.png",
  },
  {
    name: "Maltês",
    slug: "maltes",
    desc: "Elegante, dócil e com pelagem de seda brilhante. Nossa hidratação botânica e tosa na tesoura extraem o máximo da beleza desta raça ancestral.",
    type: "LUXO",
    image: "/breeds/maltes.png",
  },
  {
    name: "Yorkshire Terrier",
    slug: "yorkshire-terrier",
    desc: "Pequeno caçador com coração gigante e espírito aventureiro. Seus pelos finos demandam escovação profissional e produtos de nutrição intensa.",
    type: "ATIVO",
    image: "/breeds/yorkshire.png",
  },
  {
    name: "Shih Tzu",
    slug: "shih-tzu",
    desc: "O 'cão leão' chinês é o companheiro de colo perfeito. Banhos frequentes com tosa bebê garantem o frescor e reduzem a formação de nós.",
    type: "DÓCIL",
    image: "/breeds/shihtzu.png",
  },
  {
    name: "Pug",
    slug: "pug",
    desc: "Muito charme e personalidade em um corpo compacto. Nossa equipe veterinária atenta dedica tempo extra à higienização de suas dobras faciais.",
    type: "SOCIAL",
    image: "/breeds/pug.png",
  },
];

export default function Galeria() {
  return (
    <div className="min-h-screen bg-white font-sans text-charcoal flex flex-col">
      <Helmet>
        <title>Galeria de Raças | Small Breeds</title>
        <meta name="description" content="Conheça as raças pequenas que atendemos. Poodle Toy, Chihuahua, Maltês, Yorkshire, Shih Tzu e Pug." />
        <meta property="og:title" content="Galeria de Raças — Small Breeds" />
      </Helmet>

      <section className="bg-light-grey pt-24 md:pt-32 pb-18 md:pb-24 border-b border-border-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 text-center">
          <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-medium-grey mb-4">
            Nossa Especialidade
          </h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-light tracking-tight text-black mb-6">
            Galeria de Raças
          </h1>
          <p className="text-base md:text-lg text-medium-grey font-light max-w-2xl mx-auto leading-relaxed">
            Conheça os residentes honorários do nosso club. Nossa expertise
            técnica e estética foi moldada para atender às minuciosas
            necessidades de hidratação, tosa e saúde destes companheiros
            exclusivos.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-16">
          {breeds.map((b, i) => (
            <RevealSection key={b.name} delay={i * 80}>
              <Link
                to={`/galeria/${b.slug}`}
                className="group touch-card flex flex-col border-l border-medium-grey/10 pl-4 sm:pl-6 transition-all duration-500 hover:border-black"
              >
                <div className="aspect-[4/5] bg-light-grey mb-5 md:mb-8 relative rounded-none premium-img-container">
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-full h-full object-cover object-center grayscale contrast-110 transition-all duration-[2000ms] ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-105"
                  />

                  {/* Subtle Premium Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Minimalist Indicator */}
                  <div className="absolute bottom-6 left-6 overflow-hidden hidden lg:block">
                    <div className="flex items-center gap-3 translate-y-full opacity-0 lg:opacity-100 lg:translate-y-full group-hover:translate-y-0 reveal-child transition-all duration-700 ease-expo">
                      <span className="h-[1px] w-8 bg-black/40" />
                      <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-black/60">
                        Ver Perfil
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <span className="text-[9px] font-bold tracking-[0.3em] text-medium-grey uppercase mb-3 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                    {b.type}
                  </span>
                  <h3 className="text-2xl font-display font-light tracking-tight text-black mb-4 group-hover:translate-x-1 transition-transform duration-500">
                    {b.name}
                  </h3>
                  <p className="text-charcoal font-light leading-relaxed text-sm flex-1 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                    {b.desc}
                  </p>

                  <div className="mobile-affordance mt-6 inline-flex min-h-11 items-center gap-3 lg:hidden">
                    <span className="h-px w-8 bg-black/40" />
                    <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-black">
                      Ver perfil
                    </span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>

                  <div className="mt-8 flex items-center gap-4 group/arrow">
                    <div className="h-[1px] w-0 bg-black group-hover:w-12 transition-all duration-700 ease-expo" />
                    <span className="material-symbols-outlined text-sm -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            </RevealSection>
          ))}
        </div>
      </section>
    </div>
  );
}
