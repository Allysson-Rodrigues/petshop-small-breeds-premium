import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { breedsData } from "../data/breeds";
import { useReveal } from "../hooks/useReveal";

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
                        <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-medium-grey mb-6 block">
                            {breed.label}
                        </span>
                        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-black leading-[0.95] mb-8">
                            {breed.name}
                        </h1>
                        <div className="w-16 h-[2px] bg-black mb-8" />
                        <p className="text-base lg:text-lg text-charcoal font-light leading-relaxed max-w-md">
                            {breed.desc}
                        </p>
                        <div className="mt-12">
                            <Link
                                to="/agendamento"
                                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all duration-300 group"
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
                                <span className="text-xl font-light tracking-tight text-white">
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
                    <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-medium-grey">
                        Protocolo de Cuidados
                    </span>
                </div>
                <div ref={careRef} className="reveal-up divide-y divide-border-grey">
                    {breed.care.map((item, i) => (
                        <div
                            key={item.title}
                            className="grid lg:grid-cols-12 gap-8 py-12 group"
                            style={{ transitionDelay: `${i * 150}ms` }}
                        >
                            <div className="lg:col-span-1 flex lg:flex-col items-start gap-4">
                                <span className="text-xs font-black text-neutral-200 select-none">
                                    0{i + 1}
                                </span>
                            </div>
                            <div className="lg:col-span-3">
                                <span className="material-symbols-outlined text-3xl text-charcoal mb-4 block opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                    {item.icon}
                                </span>
                                <h2 className="text-xl font-medium uppercase tracking-tight text-black mb-1">
                                    {item.title}
                                </h2>
                                <span className="text-xs font-medium uppercase tracking-widest text-medium-grey">
                                    {item.subtitle}
                                </span>
                            </div>
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
                    <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-medium-grey mb-6 block">
                        Consultas disponíveis Seg — Sáb
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tight text-black mb-4">
                        Pronto para agendar?
                    </h2>
                    <p className="text-base text-medium-grey font-light mb-12 max-w-lg mx-auto leading-relaxed">
                        Agende uma sessão de cuidados personalizada para {breed.name} e descubra o padrão Small Breeds de excelência.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/agendamento"
                            className="inline-flex items-center justify-center gap-2 bg-black text-white px-10 py-5 text-xs font-medium uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all duration-300 group"
                        >
                            Agendar para {breed.name}
                            <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1">
                                arrow_forward
                            </span>
                        </Link>
                        <Link
                            to="/servicos"
                            className="inline-flex items-center justify-center border border-charcoal px-10 py-5 text-xs font-medium uppercase tracking-[0.2em] text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300"
                        >
                            Ver todos os serviços
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
