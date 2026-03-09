import { useEffect, useRef, useState } from "react";
import { Helmet } from "../components/seo/HelmetCompat";
import RevealSection from "../components/ui/RevealSection";
import { categories, products, type Product } from "../data/products";

export default function Catalogo() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [sortOrder, setSortOrder] = useState("padrao");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  const filteredProducts =
    activeCategory === "Todos"
      ? [...products]
      : products.filter((p) => p.category === activeCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "crescente") return a.price - b.price;
    if (sortOrder === "decrescente") return b.price - a.price;
    return 0;
  });

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedProduct(null);
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) {
        return;
      }

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      lastFocusedElementRef.current?.focus();
    };
  }, [selectedProduct]);

  const openProductDetails = (
    product: Product,
    trigger: HTMLButtonElement | null,
  ) => {
    lastFocusedElementRef.current = trigger;
    setSelectedProduct(product);
  };

  return (
    <div
      className="min-h-screen bg-white font-sans text-charcoal flex flex-col"
    >
      <Helmet>
        <title>Catálogo | Small Breeds</title>
        <meta name="description" content="Coleção exclusiva de produtos premium para raças pequenas. Acessórios de luxo, ração e cuidados." />
        <meta property="og:title" content="Catálogo — Small Breeds" />
        <meta property="og:description" content="Luxo curado para o seu companheiro mais precioso." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative h-[48vh] min-h-[380px] md:h-[60vh] md:min-h-[500px] w-full bg-light-grey flex items-center justify-center overflow-hidden pt-16">
        <img
          src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=2000"
          alt="Pomeranian em almofada de veludo"
          className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-125 brightness-90"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white mb-4 md:mb-6 font-display">
            A Coleção Small Breeds
          </h1>
          <p className="text-base md:text-xl text-white/90 font-light tracking-wide max-w-2xl">
            Luxo curado para o seu companheiro mais precioso. Experiência
            unificada, conforto elevado.
          </p>
        </div>
      </section>

      {/* Catalog Layout */}
      <section className="py-14 md:py-20 px-4 sm:px-6 md:px-12 max-w-[1600px] mx-auto w-full flex flex-col md:flex-row gap-10 md:gap-12 lg:gap-24">
        {/* Sidebar / Filters */}
        <aside className="w-full md:w-48 flex-shrink-0">
          <div className="md:sticky md:top-32">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-4 md:mb-8 text-black border-b border-border-grey pb-4">
              Categorias
            </h3>
            <ul className="flex gap-3 overflow-x-auto pb-2 md:block md:space-y-5 md:overflow-visible md:pb-0">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`min-h-11 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm tracking-wide transition-colors md:min-h-0 md:rounded-none md:border-none md:px-0 md:py-0 ${
                      activeCategory === cat
                        ? "border-black bg-black text-white md:bg-transparent md:text-black md:font-semibold"
                        : "border-border-grey text-medium-grey hover:border-black hover:text-black"
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-12 pb-4 border-b border-border-grey gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-16">
            {sortedProducts.map((p, i) => (
              <RevealSection key={p.id} delay={i * 80}>
                <article className="group touch-card flex flex-col border-l border-medium-grey/10 pl-4 sm:pl-6 transition-colors duration-500 hover:border-black">
                  <div className="aspect-square bg-light-grey mb-5 md:mb-8 relative premium-img-container group/img overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center grayscale contrast-110 transition-[filter,transform] duration-[2000ms] ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-105"
                    />

                    {/* Subtle Premium Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Minimalist Details Indicator */}
                    <div className="absolute bottom-5 left-5 md:bottom-6 md:left-6 overflow-hidden hidden lg:block">
                      <button
                        type="button"
                        onClick={(event) =>
                          openProductDetails(p, event.currentTarget)
                        }
                        className="flex items-center gap-3 translate-y-full opacity-0 lg:opacity-100 lg:translate-y-full group-hover:translate-y-0 reveal-child transition-transform duration-700 ease-expo"
                      >
                        <span className="h-[1px] w-8 bg-black/40" />
                        <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-black/60 hover:text-black transition-colors">
                          Detalhes
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

                    <button
                      type="button"
                      onClick={(event) =>
                        openProductDetails(p, event.currentTarget)
                      }
                      className="mobile-affordance mb-4 inline-flex min-h-11 items-center gap-3 lg:hidden"
                      aria-label={`Ver detalhes de ${p.name}`}
                    >
                      <span className="h-px w-8 bg-black/40" />
                      <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-black">
                        Ver detalhes
                      </span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>

                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="w-full cursor-not-allowed border border-black/20 bg-neutral-100 px-4 py-3 text-[9px] font-medium uppercase tracking-widest text-neutral-500"
                    >
                      <div className="flex items-center justify-center gap-3">
                        Comprar em breve
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <button
            type="button"
            aria-label="Fechar modal"
            className="absolute inset-0 w-full cursor-pointer border-none bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          />
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            className="relative bg-white w-full max-w-5xl max-h-[90dvh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in animate-scale-up"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Fechar modal"
              className="absolute top-3 right-3 md:top-4 md:right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black shadow-sm hover:opacity-70 transition-opacity"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>

            <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-light-grey shrink-0">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover contrast-110"
              />
            </div>

            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col overflow-y-auto">
              <span className="text-xs font-bold tracking-widest text-medium-grey uppercase mb-4">
                {selectedProduct.category}
              </span>
              <h2 id="product-modal-title" className="text-2xl md:text-3xl font-light tracking-tight text-charcoal mb-4 font-display">
                {selectedProduct.name}
              </h2>
              <div className="text-xl md:text-2xl font-bold tracking-widest text-black mb-6 md:mb-8">
                R$ {selectedProduct.price.toFixed(2)}
              </div>

              <div className="border-t border-border-grey pt-6 md:pt-8 mb-6 md:mb-8 flex-1">
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

              <button
                type="button"
                disabled
                aria-disabled="true"
                className="w-full cursor-not-allowed bg-neutral-200 px-8 py-4 text-xs font-medium uppercase tracking-widest text-neutral-500"
              >
                Carrinho em breve
              </button>
              <p className="mt-3 text-sm text-neutral-500">
                Enquanto o checkout não é liberado, fale com a equipe pelo
                telefone no rodapé para reservar este item.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
