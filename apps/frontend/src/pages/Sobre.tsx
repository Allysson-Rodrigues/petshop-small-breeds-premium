import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import RevealSection from "../components/ui/RevealSection";

export default function Sobre() {
  return (
    <div className="bg-white font-display antialiased min-h-screen flex flex-col">
      <Helmet>
        <title>Sobre Nós | Small Breeds Heritage</title>
        <meta name="description" content="Conheça a história e a filosofia por trás do petshop mais exclusivo de São Paulo, dedicado ao bem-estar das raças pequenas." />
        <meta property="og:title" content="Small Breeds Heritage — Nossa História" />
        <meta property="og:description" content="Tradição em cuidado minimalista e luxo para cães." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-white pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="grid lg:grid-cols-2 items-center gap-16">
              <div className="relative z-10 pt-8">
                <h1 className="font-display text-4xl font-light leading-tight tracking-tight text-black sm:text-5xl lg:text-6xl mb-6">
                  Paixão e Cuidado
                  <br />
                  <span className="text-medium-grey">em Cada Detalhe</span>
                </h1>
                <p className="text-lg text-charcoal font-light leading-relaxed mb-8">
                  O Petshop Small Breeds nasceu da convicção de que cães de
                  pequeno porte exigem uma atenção especializada, produtos
                  exclusivos e um ambiente de extremo conforto. Somos mais que um
                  petshop: somos um refúgio de luxo para o seu companheiro.
                </p>
                <div className="h-1 w-20 bg-black mb-8" />
                <div className="flex gap-4">
                  <Link
                    to="/servicos"
                    className="inline-flex items-center justify-center bg-black px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-800"
                  >
                    Nossos Serviços
                  </Link>
                </div>
              </div>
              <div className="relative h-[600px] mt-8 lg:mt-0 premium-img-container">
                  <img
                    alt="Pug em estúdio com fundo claro, estética minimalista"
                    className="h-full w-full object-cover grayscale brightness-95 contrast-125"
                    width={800}
                    height={600}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK_Gchu2mVI8m1UUlFcukeV40uiko9l__41-7EO_qvTsGcCcbHy71MFTf2lXav-z9cV_MTjkK_2NdrQYtc2DMmNRFUsA3HO8XFfOiUwBqXtLxLxpeMygS3Axdq11bCaOusmc7JjLhgrZoKTt4U6VqwHsvTln-Uq8Uxnox1OxF-8LOf5HfmpascJuEfZZ-jEkFg1ImDH_tIpZpjeTLeGekTyRI7JsCzOf0ZJXVxUgR9oNxEXZg8zfLvYIhjIIS09DIiB40DHAnwQSk"
                  />
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-neutral-50 py-24 border-y border-border-grey">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="mb-16 text-center">
              <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-medium-grey mb-4">
                Nossa Filosofia
              </h2>
              <h3 className="text-3xl font-light tracking-tight text-black sm:text-4xl">
                Herança de Excelência
              </h3>
            </div>
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "verified", title: "Exclusividade", desc: "Selecionamos a dedo todos os produtos e técnicas. Oferecemos apenas o que há de mais moderno e seguro para as linhagens de pequeno porte." },
              { icon: "favorite", title: "Bem-estar Animal", desc: "Respeitamos o limite e a personalidade de cada pet. Nossos procedimentos de higiene são focados na redução drástica de estresse." },
              { icon: "medical_services", title: "Corpo Clínico", desc: "Nossa equipe veterinária possui anos de experiência acadêmica e prática voltada inteiramente para raças pequenas." },
            ].map((v, i) => (
              <RevealSection key={v.title} delay={i * 100}>
                <div className="bg-white p-12 border border-border-grey hover:shadow-xl transition-shadow duration-500 ease-in-out h-full">
                  <span className="material-symbols-outlined text-4xl text-charcoal mb-6 block">
                    {v.icon}
                  </span>
                  <h4 className="text-xl font-bold tracking-tight text-black mb-4">
                    {v.title}
                  </h4>
                  <p className="text-medium-grey font-light leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-black text-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <RevealSection>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
              Faça Parte da Nossa História
            </h2>
            <p className="text-lg text-neutral-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
              Agende uma visita e venha conhecer nosso espaço. Teremos o prazer de
              cuidar do seu companheiro com todo o carinho que ele merece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/agendamento"
                className="inline-flex items-center justify-center bg-white text-black px-10 py-5 text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:bg-neutral-200"
              >
                Agendar Horário
              </Link>
              <Link
                to="/galeria"
                className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">pets</span>
                Ver Galeria de Raças
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
