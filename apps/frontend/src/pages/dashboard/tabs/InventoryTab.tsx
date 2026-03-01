import { useEffect, useState } from "react";
import { dashboardService, type ApiProduct } from "../../../services/dashboardService";

interface InventoryTabProps {
  showToast: (message: string) => void;
  searchQuery?: string;
}

type ProductForm = {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
};

const emptyForm: ProductForm = { name: "", description: "", price: "0", category: "FOOD", stock: "0" };

const stockLevel = (stock: number) => (stock > 10 ? "Normal" : stock > 3 ? "Baixo" : "Crítico");
const levelClass = (level: string) => {
  if (level === "Normal") return "bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold";
  if (level === "Baixo") return "bg-white border border-neutral-300 border-dashed text-neutral-600 italic";
  return "bg-neutral-900 text-white";
};

export default function InventoryTab({ showToast, searchQuery = "" }: InventoryTabProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<ProductForm>(emptyForm);

  useEffect(() => {
    dashboardService.getProducts()
      .then(setProducts)
      .catch(() => showToast("Falha ao carregar estoque."))
      .finally(() => setLoading(false));
  }, []);

  const handleRestock = async (id: string, name: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    try {
      const updated = await dashboardService.updateProduct(id, { stock: product.stock + 10 });
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showToast(`Estoque de ${name} atualizado (+10)!`);
    } catch {
      showToast("Falha ao repor estoque.");
    }
  };

  const handleEdit = (p: ApiProduct) => {
    setCurrentItem({ id: p.id, name: p.name, description: p.description, price: String(p.price), category: p.category, stock: String(p.stock) });
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentItem(emptyForm);
    setIsEditing(true);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await dashboardService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast(`${name} removido do estoque.`);
    } catch {
      showToast("Falha ao excluir item.");
    }
  };

  const saveItem = async () => {
    if (!currentItem.name) {
      showToast("Nome é obrigatório.");
      return;
    }
    const data = {
      name: currentItem.name,
      description: currentItem.description,
      price: Number(currentItem.price) || 0,
      category: currentItem.category,
      stock: Number(currentItem.stock) || 0,
    };
    try {
      if (currentItem.id) {
        const updated = await dashboardService.updateProduct(currentItem.id, data);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        showToast(`${currentItem.name} atualizado!`);
      } else {
        const created = await dashboardService.createProduct(data);
        setProducts((prev) => [...prev, created]);
        showToast(`${currentItem.name} adicionado!`);
      }
      setIsEditing(false);
    } catch {
      showToast("Falha ao salvar item.");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">Estoque</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Controle de insumos e produtos.</p>
        </div>
        <button onClick={handleNew}
          className="bg-neutral-900 text-white pl-4 pr-5 py-2.5 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2 w-full md:w-auto shadow-lg shadow-black/10 active:scale-95">
          <span className="material-symbols-outlined text-[20px]">add_box</span>
          Novo Item
        </button>
      </div>

      <div className={`bg-white rounded-2xl border border-[#e5e5e5] shadow-sm relative transition-all duration-300 ${isEditing ? "border-primary/20 shadow-md" : "overflow-hidden"}`}>
        {isEditing && (
          <div className="bg-white/98 z-10 flex flex-col p-6 md:p-8 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300 rounded-2xl min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary">{currentItem.id ? "Editar Item" : "Novo Item"}</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-primary transition-colors" title="Fechar">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              <div className="col-span-1 sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Nome</label>
                <input type="text" placeholder="Nome do Produto" value={currentItem.name}
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/30" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Categoria</label>
                <select value={currentItem.category} onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all bg-white">
                  <option value="FOOD">Alimentação</option>
                  <option value="ACCESSORY">Acessórios</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Preço (R$)</label>
                <input type="number" step="0.01" placeholder="0.00" value={currentItem.price}
                  onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/30" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Estoque</label>
                <input type="number" placeholder="0" value={currentItem.stock}
                  onChange={(e) => setCurrentItem({ ...currentItem, stock: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/30" />
              </div>
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Descrição</label>
                <input type="text" placeholder="Descrição do produto" value={currentItem.description}
                  onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/30" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 pt-6 border-t border-gray-100">
              <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors order-2 sm:order-1">Cancelar</button>
              <button onClick={saveItem} className="bg-neutral-900 text-white px-10 py-3 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all shadow-lg shadow-black/10 order-1 sm:order-2 active:scale-[0.98]">Salvar</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm animate-pulse">Carregando...</div>
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden divide-y divide-[#e5e5e5]">
              {filteredProducts.map((item) => {
                const level = stockLevel(item.stock);
                return (
                  <div key={item.id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-primary">{item.name}</h3>
                        <p className="text-xs text-gray-500">{item.category} • R$ {item.price.toFixed(2)}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${levelClass(level)}`}>
                        {level}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600"><span className="font-medium">Estoque:</span> {item.stock}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleRestock(item.id, item.name)}
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-200 border border-neutral-300 text-neutral-900">
                          <span className="material-symbols-outlined text-lg">add_circle</span>
                        </button>
                        <button onClick={() => handleEdit(item)}
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 border border-gray-100">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredProducts.length === 0 && !isEditing && (
                <div className="p-8 text-center text-gray-500">Nenhum item encontrado.</div>
              )}
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e5e5] text-xs uppercase text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Preço</th>
                    <th className="px-6 py-4">Estoque</th>
                    <th className="px-6 py-4">Nível</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5]">
                  {filteredProducts.map((item) => {
                    const level = stockLevel(item.stock);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-all duration-500 ease-in-out">
                        <td className="px-6 py-4 font-medium text-primary">{item.name}</td>
                        <td className="px-6 py-4 text-gray-600">{item.category}</td>
                        <td className="px-6 py-4 text-gray-600">R$ {item.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-gray-600">{item.stock}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${levelClass(level)}`}>
                            {level}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleRestock(item.id, item.name)} className="text-neutral-900 hover:text-blue-700 transition-all p-1" title="Repor (+10)">
                            <span className="material-symbols-outlined text-[18px]">add_circle</span>
                          </button>
                          <button onClick={() => handleEdit(item)} className="text-gray-400 hover:text-primary transition-all p-1 ml-2" title="Editar">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button onClick={() => handleDelete(item.id, item.name)} className="text-gray-400 hover:text-red-500 transition-all p-1 ml-2" title="Excluir">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredProducts.length === 0 && !isEditing && (
                <div className="p-8 text-center text-gray-500">Nenhum item encontrado.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
