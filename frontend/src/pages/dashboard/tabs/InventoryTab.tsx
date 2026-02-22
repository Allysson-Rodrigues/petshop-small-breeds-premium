import { useState } from "react";

interface InventoryTabProps {
  showToast: (message: string) => void;
  searchQuery?: string;
}

type InventoryData = {
  id?: number;
  name: string;
  category: string;
  sku: string;
  stock: number;
  unit: string;
  level: string;
};

export default function InventoryTab({
  showToast,
  searchQuery = "",
}: InventoryTabProps) {
  const [inventory, setInventory] = useState<InventoryData[]>([
    {
      id: 1,
      name: "Ração Premium 15kg",
      category: "Alimentação",
      sku: "AL-001",
      stock: 4,
      unit: "unid",
      level: "Baixo",
    },
    {
      id: 2,
      name: "Shampoo Lavanda 500ml",
      category: "Higiene",
      sku: "HG-042",
      stock: 12,
      unit: "unid",
      level: "Normal",
    },
    {
      id: 3,
      name: "Brinquedo Corda",
      category: "Acessórios",
      sku: "AC-105",
      stock: 8,
      unit: "unid",
      level: "Normal",
    },
    {
      id: 4,
      name: "Antipulgas Gatos",
      category: "Farmácia",
      sku: "FR-088",
      stock: 2,
      unit: "unid",
      level: "Crítico",
    },
    {
      id: 5,
      name: "Petiscos de Carne",
      category: "Alimentação",
      sku: "AL-022",
      stock: 25,
      unit: "unid",
      level: "Normal",
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryData>({
    name: "",
    category: "Outros",
    sku: "",
    stock: 0,
    unit: "unid",
    level: "Normal",
  });

  const handleRestock = (id: number, name: string) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = item.stock + 10;
          const newLevel =
            newStock > 10 ? "Normal" : newStock > 5 ? "Baixo" : "Crítico";
          return { ...item, stock: newStock, level: newLevel };
        }
        return item;
      }),
    );
    showToast(`Lote recebido. Estoque de ${name} atualizado (+10 unid)!`);
  };

  const handleEdit = (item: InventoryData) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentItem({
      name: "",
      category: "Outros",
      sku: `SKU-${Math.floor(Math.random() * 1000)}`,
      stock: 0,
      unit: "unid",
      level: "Normal",
    });
    setIsEditing(true);
  };

  const handleDelete = (id: number, name: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    showToast(`Item ${name} removido do estoque.`);
  };

  const saveItem = () => {
    if (!currentItem.name) {
      showToast("O nome do Item é obrigatório.");
      return;
    }

    const newStock = Number(currentItem.stock);
    const newLevel =
      newStock > 10 ? "Normal" : newStock > 5 ? "Baixo" : "Crítico";
    const finalItem = { ...currentItem, stock: newStock, level: newLevel };

    if (currentItem.id) {
      setInventory((prev) =>
        prev.map((i) =>
          i.id === currentItem.id ? (finalItem as InventoryData) : i,
        ),
      );
      showToast(`Item ${currentItem.name} atualizado!`);
    } else {
      const newId =
        inventory.length > 0
          ? Math.max(...inventory.map((i) => i.id || 0)) + 1
          : 1;
      setInventory((prev) => [
        ...prev,
        { ...finalItem, id: newId } as InventoryData,
      ]);
      showToast(`Item ${currentItem.name} adicionado ao estoque!`);
    }
    setIsEditing(false);
  };

  const filteredInventory = inventory.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">
            Estoque
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Controle de insumos e produtos para venda.
          </p>
        </div>
        <button
          onClick={handleNew}
          className="bg-primary text-white px-4 py-2.5 md:py-2 rounded-lg text-sm font-medium hover:bg-[#4d4d4d] transition-all duration-500 ease-in-out flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_box</span>
          Novo Item
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm overflow-hidden relative">
        {isEditing && (
          <div className="absolute inset-0 bg-white/95 z-10 flex flex-col p-6 backdrop-blur-sm animate-in fade-in">
            <h2 className="text-lg font-bold text-primary mb-4">
              {currentItem.id ? "Editar Item" : "Novo Item"}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nome do Produto"
                value={currentItem.name}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, name: e.target.value })
                }
                className="col-span-2 border border-[#e5e5e5] rounded p-2 text-sm"
              />
              <select
                value={currentItem.category}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, category: e.target.value })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm bg-white"
              >
                <option value="Alimentação">Alimentação</option>
                <option value="Higiene">Higiene</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Farmácia">Farmácia</option>
                <option value="Outros">Outros</option>
              </select>
              <input
                type="text"
                placeholder="SKU"
                value={currentItem.sku}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, sku: e.target.value })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm font-mono"
              />
              <input
                type="number"
                placeholder="Estoque Inicial"
                value={currentItem.stock}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    stock: Number(e.target.value),
                  })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm"
              />
              <input
                type="text"
                placeholder="Unidade (ex: kg, unid)"
                value={currentItem.unit}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, unit: e.target.value })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm"
              />
            </div>
            <div className="flex justify-between mt-auto">
              {currentItem.id && (
                <button
                  onClick={() =>
                    handleDelete(currentItem.id!, currentItem.name)
                  }
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    delete
                  </span>
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveItem}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-black"
                >
                  Salvar Detalhes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-[#e5e5e5]">
          {filteredInventory.map((item) => (
            <div key={item.id} className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-primary">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.category} • {item.sku}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${item.level === "Normal"
                    ? "bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold"
                    : item.level === "Baixo"
                      ? "bg-white border border-neutral-300 border-dashed text-neutral-600 italic"
                      : "bg-neutral-900 text-white text-white"
                    }`}
                >
                  {item.level}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Estoque:</span> {item.stock} {item.unit}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestock(item.id!, item.name)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-200 border border-neutral-300 text-neutral-900 font-bold border border-blue-100"
                  >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 border border-gray-100"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredInventory.length === 0 && !isEditing && (
            <div className="p-8 text-center text-gray-500">
              Nenhum item encontrado no estoque.
            </div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-[#e5e5e5] text-xs uppercase text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Nível</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-all duration-500 ease-in-out"
                >
                  <td className="px-6 py-4 font-medium text-primary">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.stock} {item.unit}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.level === "Normal"
                        ? "bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold"
                        : item.level === "Baixo"
                          ? "bg-white border border-neutral-300 border-dashed text-neutral-600 italic"
                          : "bg-neutral-900 text-white text-white"
                        }`}
                    >
                      {item.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRestock(item.id!, item.name)}
                      className="text-neutral-900 font-bold hover:text-blue-700 transition-all duration-500 ease-in-out p-1"
                      title="Repor Estoque (+10)"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        add_circle
                      </span>
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-gray-400 hover:text-primary transition-all duration-500 ease-in-out p-1 ml-2"
                      title="Editar Detalhes"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredInventory.length === 0 && !isEditing && (
            <div className="p-8 text-center text-gray-500">
              Nenhum item encontrado no estoque.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
