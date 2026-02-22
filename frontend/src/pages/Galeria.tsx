import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

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

      <section className="bg-light-grey pt-32 pb-24 border-b border-border-grey">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-medium-grey mb-4">
            Nossa Especialidade
          </h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-light tracking-tight text-black mb-6">
            Galeria de Raças
          </h1>
          <p className="text-lg text-medium-grey font-light max-w-2xl mx-auto leading-relaxed">
            Conheça os residentes honorários do nosso club. Nossa expertise
            técnica e estética foi moldada para atender às minuciosas
            necessidades de hidratação, tosa e saúde destes companheiros
            exclusivos.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {breeds.map((b) => (
            <article key={b.name} className="group flex flex-col cursor-pointer">
              <div className="aspect-[4/3] bg-light-grey mb-8 overflow-hidden relative rounded-none">
                <img
                  src={b.image}
                  alt={b.name}
                  className="w-full h-full object-cover object-center grayscale contrast-110 transition-all duration-[3000ms] group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-105"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
                  <Link
                    to={`/galeria/${b.slug}`}
                    className="text-white bg-black/85 backdrop-blur-md px-4 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between gap-2 hover:bg-black transition-colors"
                  >
                    Explorar Cuidados
                    <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col flex-1 pl-2 border-l border-medium-grey/20">
                <span className="text-[10px] font-bold tracking-[0.2em] text-medium-grey uppercase mb-2">
                  Perfil {b.type}
                </span>
                <h3 className="text-2xl font-display font-medium tracking-tight text-black mb-4">
                  {b.name}
                </h3>
                <p className="text-charcoal font-light leading-relaxed text-sm flex-1">
                  {b.desc}
                </p>
                <Link
                  to={`/galeria/${b.slug}`}
                  className="mt-6 text-[10px] font-black uppercase tracking-widest text-charcoal hover:text-black transition-colors flex items-center gap-2 group/link"
                >
                  Ver cuidados
                  <span className="material-symbols-outlined text-xs transition-transform duration-200 group-hover/link:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
