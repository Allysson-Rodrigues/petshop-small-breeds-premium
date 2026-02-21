import { useState } from "react";
import { categories, products } from "../data/products";

export default function Catalogo() {
  // SEO: <title>Catálogo | Small Breeds</title>
  // <meta name="description" content="Produtos exclusivos para raças pequenas." />
  // <meta property="og:title" content="Catálogo | Small Breeds" />

  const [activeCategory, setActiveCategory] = useState("Todos");
  const [sortOrder, setSortOrder] = useState("padrao");

  const filteredProducts =
    activeCategory === "Todos"
      ? [...products]
      : products.filter((p) => p.category === activeCategory);

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOrder === "crescente") return a.price - b.price;
    if (sortOrder === "decrescente") return b.price - a.price;
    return 0; // "padrao" não altera a ordem do ID
  });

  return (
    <div className="min-h-screen bg-white font-sans text-charcoal flex flex-col">
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
            The Small Breed Collection
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-light tracking-wide max-w-2xl">
            Luxo curador para o seu companheiro mais precioso. Experiência
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
                    className={`text-sm tracking-wide transition-colors ${
                      activeCategory === cat
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
            {sortedProducts.map((p) => (
              <article
                key={p.id}
                className="group cursor-pointer flex flex-col"
              >
                <div className="aspect-[4/5] bg-light-grey mb-6 overflow-hidden relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center grayscale contrast-110 group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Botão Hover Escuro Minimalista */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300">
                      Visualizar
                    </button>
                  </div>
                </div>
                <div className="flex flex-col flex-1 text-center items-center">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-medium-grey uppercase mb-2">
                    {p.category}
                  </span>
                  <h3 className="text-sm font-medium tracking-wide text-charcoal mb-3 flex-1">
                    {p.name}
                  </h3>
                  <span className="text-sm font-bold tracking-widest text-black mb-5">
                    R$ {p.price}
                  </span>
                  <button className="w-full border border-black bg-transparent text-black px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300">
                    Adicionar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
