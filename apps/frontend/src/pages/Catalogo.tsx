import { useState } from "react";
import { Helmet } from "react-helmet-async";
import RevealSection from "../components/ui/RevealSection";
import { categories, products, type Product } from "../data/products";

export default function Catalogo() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [sortOrder, setSortOrder] = useState("padrao");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts =
    activeCategory === "Todos"
      ? [...products]
      : products.filter((p) => p.category === activeCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "crescente") return a.price - b.price;
    if (sortOrder === "decrescente") return b.price - a.price;
    return 0;
  });

  return (
    <div
      className="min-h-screen bg-white font-sans text-charcoal flex flex-col"
      onKeyDown={() => undefined}
    >
      <Helmet>
        <title>Catálogo | Small Breeds</title>
        <meta name="description" content="Coleção exclusiva de produtos premium para raças pequenas. Acessórios de luxo, ração e cuidados." />
        <meta property="og:title" content="Catálogo — Small Breeds" />
        <meta property="og:description" content="Luxo curado para o seu companheiro mais precioso." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full bg-light-grey flex items-center justify-center overflow-hidden pt-16">
        <img
          src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=2000"
          alt="Pomeranian em almofada de veludo"
          className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-125 brightness-90"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6 font-display">
            A Coleção Small Breeds
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-light tracking-wide max-w-2xl">
            Luxo curado para o seu companheiro mais precioso. Experiência
            unificada, conforto elevado.
          </p>
        </div>
      </section>

      {/* Catalog Layout */}
      <section className="py-20 px-6 md:px-12 max-w-[1600px] mx-auto w-full flex flex-col md:flex-row gap-12 lg:gap-24">
        {/* Sidebar / Filters */}
        <aside className="w-full md:w-48 flex-shrink-0">
          <div className="sticky top-32">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-black border-b border-border-grey pb-4">
              Categorias
            </h3>
            <ul className="space-y-5">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`text-sm tracking-wide transition-colors ${activeCategory === cat
                      ? "text-black font-semibold"
                      : "text-medium-grey hover:text-black"
                      }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 pb-4 border-b border-border-grey gap-4">
            <span className="text-sm text-medium-grey font-light">
              Exibindo {sortedProducts.length} produtos
            </span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-medium-grey">
                tune
              </span>
              <select
                className="text-sm tracking-wide text-black bg-transparent border-none outline-none cursor-pointer hover:opacity-70 transition-opacity focus:ring-0"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="padrao">Ordenar: Padrão</option>
                <option value="crescente">Preço: Menor para Maior</option>
                <option value="decrescente">Preço: Maior para Menor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {sortedProducts.map((p, i) => (
              <RevealSection key={p.id} delay={i * 80}>
                <article className="group flex flex-col border-l border-medium-grey/10 pl-6 transition-all duration-500 hover:border-black">
                  <div className="aspect-[4/5] bg-light-grey mb-8 overflow-hidden relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center grayscale contrast-110 transition-all duration-[2000ms] ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-105"
                    />

                    {/* Subtle Premium Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Minimalist Quick View Indicator */}
                    <div className="absolute bottom-6 left-6 overflow-hidden">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="flex items-center gap-3 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-expo"
                      >
                        <span className="h-[1px] w-8 bg-black/40" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-black/60 hover:text-black transition-colors">
                          Vista Rápida
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 items-start text-left">
                    <span className="text-[9px] font-bold tracking-[0.3em] text-medium-grey uppercase mb-3 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                      {p.category}
                    </span>
                    <h3 className="text-base font-display font-light tracking-tight text-black mb-1 group-hover:translate-x-1 transition-transform duration-500">
                      {p.name}
                    </h3>
                    <span className="text-sm font-bold tracking-widest text-black mb-6">
                      R$ {p.price.toFixed(2)}
                    </span>

                    <button className="w-full border border-black bg-transparent text-black px-4 py-3 text-[9px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500 group/btn">
                      <div className="flex items-center justify-center gap-3">
                        Comprar Agora
                        <span className="material-symbols-outlined text-xs -translate-x-2 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-500">
                          arrow_forward
                        </span>
                      </div>
                    </button>
                  </div>
                </article>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative bg-white w-full max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in animate-scale-up">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 text-black hover:opacity-50 transition-opacity"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>

            <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-light-grey">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover grayscale contrast-110"
              />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
              <span className="text-xs font-bold tracking-widest text-medium-grey uppercase mb-4">
                {selectedProduct.category}
              </span>
              <h2 className="text-3xl font-light tracking-tight text-charcoal mb-4 font-display">
                {selectedProduct.name}
              </h2>
              <div className="text-2xl font-bold tracking-widest text-black mb-8">
                R$ {selectedProduct.price.toFixed(2)}
              </div>

              <div className="border-t border-border-grey pt-8 mb-8 flex-1">
                <p className="text-charcoal/80 leading-relaxed mb-6 font-light">
                  {selectedProduct.description}
                </p>
                {selectedProduct.details && (
                  <ul className="space-y-3">
                    {selectedProduct.details.map((detail: string, i: number) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-charcoal/70 font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-black/20"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button className="w-full bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg active:scale-95">
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
