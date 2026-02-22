import { Link } from "react-router-dom";

export default function Sobre() {
  // SEO: <title>Sobre Nós | Small Breeds Heritage</title>
  // <meta name="description" content="Conheça a história e a filosofia por trás do petshop mais exclusivo de São Paulo, dedicado ao bem-estar das raças pequenas." />
  // <meta property="og:title" content="Small Breeds Heritage - Nossa História" />
  // <meta property="og:description" content="Tradição em cuidado minimalista e luxo para cães." />
  // <meta name="keywords" content="história small breeds, petshop luxo sp, filosofia cuidado animal" />
  return (
    <div className="bg-background-light font-display antialiased min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 items-center gap-16">
            <div className="relative z-10 pt-8">
              <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-primary sm:text-5xl lg:text-6xl mb-6">
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
              <div className="h-1 w-20 bg-primary mb-8"></div>
              <div className="flex gap-4">
                <Link
                  to="/agendamento"
                  className="inline-flex items-center justify-center bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all btn-magnetic"
                >
                  Nossos Serviços
                </Link>
              </div>
            </div>
            <div className="relative h-[600px] overflow-hidden rounded-sm mt-8 lg:mt-0">
              <img
                alt="Pug em estúdio com fundo claro, estética minimalista"
                className="h-full w-full object-cover grayscale brightness-95 contrast-125"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK_Gchu2mVI8m1UUlFcukeV40uiko9l__41-7EO_qvTsGcCcbHy71MFTf2lXav-z9cV_MTjkK_2NdrQYtc2DMmNRFUsA3HO8XFfOiUwBqXtLxLxpeMygS3Axdq11bCaOusmc7JjLhgrZoKTt4U6VqwHsvTln-Uq8Uxnox1OxF-8LOf5HfmpascJuEfZZ-jEkFg1ImDH_tIpZpjeTLeGekTyRI7JsCzOf0ZJXVxUgR9oNxEXZg8zfLvYIhjIIS09DIiB40DHAnwQSk"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content / Values Section */}
      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-medium-grey mb-4">
              Nossa Filosofia
            </h2>
            <h3 className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
              Herança de Excelência
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white p-12 border border-[#e5e5e5] hover:shadow-xl transition-all duration-500 ease-in-out">
              <span className="material-symbols-outlined text-4xl text-primary mb-6">
                verified
              </span>
              <h4 className="text-xl font-bold tracking-tight text-primary mb-4">
                Exclusividade
              </h4>
              <p className="text-gray-500 font-light leading-relaxed">
                Selecionamos a dedo todos os produtos e técnicas. Oferecemos
                apenas o que há de mais moderno e seguro para as linhagens de
                pequeno porte.
              </p>
            </div>
            {/* Value 2 */}
            <div className="bg-white p-12 border border-[#e5e5e5] hover:shadow-xl transition-all duration-500 ease-in-out">
              <span className="material-symbols-outlined text-4xl text-primary mb-6">
                favoriting
              </span>
              <h4 className="text-xl font-bold tracking-tight text-primary mb-4">
                Bem-estar Animal
              </h4>
              <p className="text-gray-500 font-light leading-relaxed">
                Respeitamos o limite e a personalidade de cada pet. Nossos
                procedimentos de higiene são focados na redução drástica de
                estresse.
              </p>
            </div>
            {/* Value 3 */}
            <div className="bg-white p-12 border border-[#e5e5e5] hover:shadow-xl transition-all duration-500 ease-in-out">
              <span className="material-symbols-outlined text-4xl text-primary mb-6">
                medical_services
              </span>
              <h4 className="text-xl font-bold tracking-tight text-primary mb-4">
                Corpo Clínico
              </h4>
              <p className="text-gray-500 font-light leading-relaxed">
                Nossa equipe veterinária possui anos de experiência acadêmica e
                prática voltada inteiramente para raças pequenas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
