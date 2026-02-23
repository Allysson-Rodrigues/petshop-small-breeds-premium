import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useReveal } from "../hooks/useReveal";

// ─── Breed data ────────────────────────────────────────────────────────────────
const breedsData: Record<string, {
    name: string;
    label: string;
    desc: string;
    image: string;
    stats: { label: string; value: string }[];
    care: { icon: string; title: string; subtitle: string; desc: string }[];
}> = {
    "poodle-toy": {
        name: "Poodle Toy",
        label: "PERFIL COMPANHIA",
        desc: "Elegância compacta e inteligência vibrante. O Poodle Toy é a definição de luxo em miniatura, exigindo cuidados técnicos de alto padrão para manter sua pelagem impecável.",
        image: "/breeds/poodle.png",
        stats: [
            { label: "Tosa", value: "Mensal" },
            { label: "Banho", value: "Quinzenal" },
            { label: "Atividade", value: "Moderada" },
            { label: "Pelagem", value: "Ondulada" },
        ],
        care: [
            {
                icon: "cut",
                title: "Tosa Artesanal",
                subtitle: "Standard de Exibição",
                desc: "Cortes precisos modelados para o padrão de raça Poodle. Realizamos os estilos Continental, Cubo e Puppy Clip com tesoura artesanal para acabamento geométrico e simétrico.",
            },
            {
                icon: "bathtub",
                title: "Banho Premium",
                subtitle: "Hidratação Profunda",
                desc: "Shampoos hipoalergênicos de alta hidratação com fragrância persistente. Secagem em temperatura controlada preservando os cachos naturais e o volume da pelagem.",
            },
            {
                icon: "medical_services",
                title: "Saúde Veterinária",
                subtitle: "Medicina Preventiva",
                desc: "Check-up específico: análise auditiva detalhada, profilaxia dental e monitoramento ocular. Vacinação e vermifugação rigorosamente programadas.",
            },
        ],
    },
    "chihuahua": {
        name: "Chihuahua",
        label: "PERFIL VALENTE",
        desc: "O menor cão do mundo carrega a maior personalidade. Requer atenção especial à temperatura corporal e produtos delicados e hipoalergênicos adaptados à sua pele sensível.",
        image: "/breeds/chihuahua.png",
        stats: [
            { label: "Tosa", value: "Bimestral" },
            { label: "Banho", value: "Mensal" },
            { label: "Atividade", value: "Alta" },
            { label: "Pelagem", value: "Curta/Lisa" },
        ],
        care: [
            {
                icon: "cut",
                title: "Tosa Higiênica",
                subtitle: "Cuidado Delicado",
                desc: "Tosa de higiene nas áreas sensíveis com lâminas de precisão. Tratamento especial para os pelos das patas e ouvidos, prevenindo acúmulo de sujidades.",
            },
            {
                icon: "bathtub",
                title: "Banho Termorregulatório",
                subtitle: "Conforto Térmico",
                desc: "Protocolo especial com água morna e secagem imediata evitando quedas de temperatura. Produtos ultra-suaves e hipoalergênicos para a pele sensível desta raça delicada.",
            },
            {
                icon: "medical_services",
                title: "Saúde Preventiva",
                subtitle: "Atenção Especializada",
                desc: "Monitoramento cardíaco e dental intensivo — raças toy são mais propensas a doenças periodontais. Avaliação regular do peso e articulações com nossa equipe veterinária.",
            },
        ],
    },
    "maltes": {
        name: "Maltês",
        label: "PERFIL LUXO",
        desc: "Elegante, dócil e com pelagem de seda brilhante. Nossa hidratação botânica e tosa na tesoura extraem o máximo da beleza desta raça ancestral de origem mediterrânea.",
        image: "/breeds/maltes.png",
        stats: [
            { label: "Tosa", value: "Mensal" },
            { label: "Banho", value: "Semanal" },
            { label: "Atividade", value: "Baixa" },
            { label: "Pelagem", value: "Longa/Sedosa" },
        ],
        care: [
            {
                icon: "cut",
                title: "Tosa na Tesoura",
                subtitle: "Corte Artesanal",
                desc: "A pelagem longa e sedosa do Maltês exige cortes exclusivos na tesoura. Realizamos o corte de manutenção e o corte de show, com escovação que elimina todos os nós.",
            },
            {
                icon: "bathtub",
                title: "Hidratação Botânica",
                subtitle: "Ritual de Seda",
                desc: "Protocolo de hidratação com óleos de argan e seda vegetal que potencializa o brilho e a maciez da pelagem branca. Branqueamento natural sem agentes agressivos.",
            },
            {
                icon: "medical_services",
                title: "Cuidado Ocular",
                subtitle: "Higiene Premium",
                desc: "Limpeza especializada ao redor dos olhos para prevenir manchas de lacrimal. Avaliação dermatológica regular para a sensível pele do Maltês sob a densa pelagem.",
            },
        ],
    },
    "yorkshire-terrier": {
        name: "Yorkshire Terrier",
        label: "PERFIL ATIVO",
        desc: "Pequeno caçador com coração gigante e espírito aventureiro. Seus pelos finos demandam escovação profissional e produtos de nutrição intensa para manter o brilho.",
        image: "/breeds/yorkshire.png",
        stats: [
            { label: "Tosa", value: "Mensal" },
            { label: "Banho", value: "Quinzenal" },
            { label: "Atividade", value: "Alta" },
            { label: "Pelagem", value: "Fina/Sedosa" },
        ],
        care: [
            {
                icon: "cut",
                title: "Tosa Estilosa",
                subtitle: "Corte de Personalidade",
                desc: "O Yorkshire tem um coat que cresce constantemente como cabelo humano. Oferecemos o corte de manutenção curto, o corte longo de exibição e a tradicional topete com laço.",
            },
            {
                icon: "bathtub",
                title: "Nutrição Intensiva",
                subtitle: "Fios com Vitalidade",
                desc: "Shampoos proteicos e condicionadores de queratina que fortalecem os fios finos e evitam quebra. Hidratação profunda que mantém o brilho sedoso característico da raça.",
            },
            {
                icon: "medical_services",
                title: "Saúde Articular",
                subtitle: "Cuidado Preventivo",
                desc: "Yorkshire são propensos a problemas de patela. Nossa equipe realiza avaliação locomotora e dental a cada visita, acompanhando o histórico clínico completo do seu pet.",
            },
        ],
    },
    "shih-tzu": {
        name: "Shih Tzu",
        label: "PERFIL DÓCIL",
        desc: "O 'cão leão' chinês é o companheiro de colo perfeito. Banhos frequentes com a tosa bebê garantem o frescor e reduzem a formação de nós na sua pelagem densa.",
        image: "/breeds/shihtzu.png",
        stats: [
            { label: "Tosa", value: "Mensal" },
            { label: "Banho", value: "Quinzenal" },
            { label: "Atividade", value: "Baixa" },
            { label: "Pelagem", value: "Densa/Dupla" },
        ],
        care: [
            {
                icon: "cut",
                title: "Tosa Bebê",
                subtitle: "Conforto Total",
                desc: "A tosa bebê no Shih Tzu traz praticidade sem perder o charme. Também realizamos a tosa longa de show e o estilo coreano, mantendo a pelagem organizada e livre de nós.",
            },
            {
                icon: "bathtub",
                title: "Desamarrante Profissional",
                subtitle: "Pelagem Liberta",
                desc: "Protocolo de desembaraçamento antes do banho com produtos específicos. Shampoo de dupla camada que limpa tanto a subcamada quanto o manto superior, seguido de secagem com escova.",
            },
            {
                icon: "medical_services",
                title: "Cuidado Respiratório",
                subtitle: "Saúde Braquicéfala",
                desc: "Como raça braquicéfala, o Shih Tzu requer monitoramento respiratório e limpeza de prega nasal. Nossa veterinária acompanha a saúde ocular e auditiva a cada consulta.",
            },
        ],
    },
    "pug": {
        name: "Pug",
        label: "PERFIL SOCIAL",
        desc: "Muito charme e personalidade em um corpo compacto. Nossa equipe veterinária atenta dedica tempo extra à higienização cuidadosa das suas famosas dobras faciais.",
        image: "/breeds/pug.png",
        stats: [
            { label: "Tosa", value: "Bimestral" },
            { label: "Banho", value: "Quinzenal" },
            { label: "Atividade", value: "Moderada" },
            { label: "Pelagem", value: "Curta/Densa" },
        ],
        care: [
            {
                icon: "cut",
                title: "Tosa Higiênica",
                subtitle: "Limpeza Facial",
                desc: "Tosa de higiene entre as dobras faciais e nas áreas sensíveis. Usamos lâminas de tamanho micro para a limpeza das rugas sem irritar a pele delicada desta raça única.",
            },
            {
                icon: "bathtub",
                title: "Higiene das Dobras",
                subtitle: "Ritual Anti-inflamatório",
                desc: "Protocolo especial de limpeza e secagem das dobras com produtos dermatologicamente testados. Prevenção ativa de dermatites e infecções cutâneas nestas regiões sensíveis.",
            },
            {
                icon: "medical_services",
                title: "Monitoramento Respiratório",
                subtitle: "Braquicéfalos VIP",
                desc: "Avaliação da qualidade respiratória, palatina e nasal a cada visita. Nossa equipe monitora peso, oxigenação e saúde ocular — áreas críticas para a qualidade de vida do Pug.",
            },
        ],
    },
};

// ─── Page component ────────────────────────────────────────────────────────────
export default function RacaCuidados() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const breed = slug ? breedsData[slug] : null;

    useEffect(() => {
        if (!breed) navigate("/galeria", { replace: true });
    }, [breed, navigate]);

    const heroRef = useReveal(0);
    const statsRef = useReveal(100);
    const careRef = useReveal(0);
    const ctaRef = useReveal(200);

    if (!breed) return null;

    return (
        <div className="min-h-screen bg-white font-sans text-charcoal">
            <Helmet>
                <title>{breed.name} — Cuidados | Small Breeds</title>
                <meta name="description" content={breed.desc} />
                <meta property="og:title" content={`${breed.name} — Small Breeds`} />
            </Helmet>

            {/* ── HERO ── */}
            <section className="relative bg-white border-b border-border-grey overflow-hidden min-h-[65vh] flex items-stretch">
                <div ref={heroRef} className="reveal-up w-full grid lg:grid-cols-2">

                    {/* Left — Text */}
                    <div className="flex flex-col justify-center px-8 py-20 lg:px-16 lg:py-28">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-medium-grey mb-6 block">
                            {breed.label}
                        </span>
                        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-black leading-[0.95] mb-8">
                            {breed.name}
                        </h1>
                        <div className="w-16 h-[2px] bg-black mb-8" />
                        <p className="text-base lg:text-lg text-charcoal font-light leading-relaxed max-w-md">
                            {breed.desc}
                        </p>
                        <div className="mt-12">
                            <Link
                                to="/agendamento"
                                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all duration-300 group"
                            >
                                Agendar para {breed.name}
                                <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1">
                                    arrow_forward
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Right — Image */}
                    <div className="relative min-h-[400px] lg:min-h-0 bg-neutral-50 border-l border-border-grey overflow-hidden">
                        <img
                            src={breed.image}
                            alt={breed.name}
                            className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-110 transition-all duration-[3000ms] hover:grayscale-0 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/5" />
                    </div>
                </div>
            </section>

            {/* ── STATS BAR ── */}
            <section className="bg-black text-white">
                <div ref={statsRef} className="reveal-up max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
                        {breed.stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center py-8 px-6 text-center">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-2">
                                    {stat.label}
                                </span>
                                <span className="text-xl font-black tracking-tight text-white">
                                    {stat.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CARE SECTIONS ── */}
            <section className="py-24 max-w-7xl mx-auto px-8 lg:px-16">
                <div className="mb-16">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-medium-grey">
                        Protocolo de Cuidados
                    </span>
                </div>
                <div ref={careRef} className="reveal-up divide-y divide-border-grey">
                    {breed.care.map((item, i) => (
                        <div
                            key={item.title}
                            className="grid lg:grid-cols-12 gap-8 py-12 group"
                            style={{
                                animationDelay: `${i * 150}ms`,
                            }}
                        >
                            {/* Number */}
                            <div className="lg:col-span-1 flex lg:flex-col items-start gap-4">
                                <span className="text-xs font-black text-neutral-200 select-none">
                                    0{i + 1}
                                </span>
                            </div>

                            {/* Icon + Title */}
                            <div className="lg:col-span-3">
                                <span className="material-symbols-outlined text-3xl text-charcoal mb-4 block opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                    {item.icon}
                                </span>
                                <h2 className="text-xl font-black uppercase tracking-tight text-black mb-1">
                                    {item.title}
                                </h2>
                                <span className="text-xs font-bold uppercase tracking-widest text-medium-grey">
                                    {item.subtitle}
                                </span>
                            </div>

                            {/* Description */}
                            <div className="lg:col-span-7 lg:col-start-6 flex items-center">
                                <p className="text-base text-charcoal font-light leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-neutral-50 border-t border-border-grey py-24">
                <div ref={ctaRef} className="reveal-up max-w-4xl mx-auto px-8 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-medium-grey mb-6 block">
                        Consultas disponíveis Seg — Sáb
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-4">
                        Pronto para agendar?
                    </h2>
                    <p className="text-base text-medium-grey font-light mb-12 max-w-lg mx-auto leading-relaxed">
                        Agende uma sessão de cuidados personalizada para {breed.name} e descubra o padrão Small Breeds de excelência.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/agendamento"
                            className="inline-flex items-center justify-center gap-2 bg-black text-white px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all duration-300 group"
                        >
                            Agendar para {breed.name}
                            <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1">
                                arrow_forward
                            </span>
                        </Link>
                        <Link
                            to="/servicos"
                            className="inline-flex items-center justify-center border border-charcoal px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300"
                        >
                            Ver todos os serviços
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
