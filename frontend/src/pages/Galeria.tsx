export default function Galeria() {
  // SEO: <title>Galeria de Raças | Small Breeds</title>
  // <meta name="description" content="Conheça as raças pequenas que atendemos." />
  // <meta property="og:title" content="Galeria de Raças | Small Breeds" />

  const breeds = [
    {
      name: "Poodle Toy",
      desc: "Altamente inteligente e extremamente leal, possui uma pelagem que requer cuidados de tosa artesanal constantes para manter o alto padrão estético.",
      type: "COMPANHIA",
      image:
        "https://images.unsplash.com/photo-1593134257782-e89567b7718a?auto=format&fit=crop&q=80&w=800&grayscale=true",
    },
    {
      name: "Chihuahua",
      desc: "O menor cão do mundo carrega a maior personalidade. Requer atenção especial à temperatura e produtos delicados e hipoalergênicos no banho.",
      type: "VALENTE",
      image:
        "https://images.unsplash.com/photo-1605897472359-85e4b94d685d?auto=format&fit=crop&q=80&w=800&grayscale=true",
    },
    {
      name: "Maltês",
      desc: "Elegante, dócil e com pelagem de seda brilhante. Nossa hidratação botânica e tosa na tesoura extraem o máximo da beleza desta raça ancestral.",
      type: "LUXO",
      image:
        "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&q=80&w=800&grayscale=true",
    },
    {
      name: "Yorkshire Terrier",
      desc: "Pequeno caçador com coração gigante e espírito aventureiro. Seus pelos finos demandam escovação profissional e produtos de nutrição intensa.",
      type: "ATIVO",
      image:
        "https://images.unsplash.com/photo-1589924691995-400dc9ce8cee?auto=format&fit=crop&q=80&w=800&grayscale=true",
    },
    {
      name: "Shih Tzu",
      desc: "O 'cão leão' chinês é o companheiro de colo perfeito. Banhos frequentes com tosa bebê garantem o frescor e reduzem a formação de nós.",
      type: "DÓCIL",
      image:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800&grayscale=true",
    },
    {
      name: "Pug",
      desc: "Muito charme e personalidade em um corpo compacto. Nossa equipe veterinária atenta dedica tempo extra à higienização de suas dobras faciais.",
      type: "SOCIAL",
      image:
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800&grayscale=true",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-charcoal flex flex-col">
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
            <article key={b.name} className="group flex flex-col">
              <div className="aspect-[4/3] bg-light-grey mb-8 overflow-hidden relative">
                <img
                  src={b.image}
                  alt={b.name}
                  className="w-full h-full object-cover object-center grayscale contrast-110 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity">
                    Explorar Cuidados
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </button>
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
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
