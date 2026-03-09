import { useState } from "react";
import { dashboardService, type ApiProduct } from "../../../services/dashboardService";
import { DashboardActionButton } from "../components/DashboardActionButton";
import {
  DashboardCollectionPanel,
  DashboardFormField,
  DashboardFormGrid,
  DashboardInlineForm,
  dashboardInputClassName,
  dashboardSelectClassName,
} from "../components/DashboardForm";
import { ResponsiveCollectionView } from "../components/ResponsiveCollectionView";
import { TabSectionHeader } from "../components/TabSectionHeader";
import { TabLoadingState } from "../components/TabState";
import { useInventoryData } from "../hooks/useDashboardData";

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
  const {
    addProduct,
    loading,
    products,
    removeProduct,
    updateProductInList,
  } = useInventoryData(showToast);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<ProductForm>(emptyForm);

  const handleRestock = async (id: string, name: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    try {
      const updated = await dashboardService.updateProduct(id, { stock: product.stock + 10 });
      updateProductInList(id, () => updated);
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
      removeProduct(id);
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
        updateProductInList(currentItem.id, () => updated);
        showToast(`${currentItem.name} atualizado!`);
      } else {
        const created = await dashboardService.createProduct(data);
        addProduct(created);
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
      <TabSectionHeader
        title="Estoque"
        description="Controle de insumos e produtos."
        action={
          <button onClick={handleNew}
            className="bg-neutral-900 text-white pl-4 pr-5 py-2.5 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2 w-full md:w-auto shadow-lg shadow-black/10 active:scale-95">
            <span className="material-symbols-outlined text-[20px]">add_box</span>
            Novo Item
          </button>
        }
      />

      <DashboardCollectionPanel isEditing={isEditing}>
        {isEditing && (
          <DashboardInlineForm
            onCancel={() => setIsEditing(false)}
            onClose={() => setIsEditing(false)}
            onSubmit={saveItem}
            submitLabel="Salvar"
            title={currentItem.id ? "Editar Item" : "Novo Item"}
          >
            <DashboardFormGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <DashboardFormField className="col-span-1 sm:col-span-2" label="Nome">
                <input
                  type="text"
                  placeholder="Nome do Produto"
                  value={currentItem.name}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, name: e.target.value })
                  }
                  className={dashboardInputClassName}
                />
              </DashboardFormField>
              <DashboardFormField label="Categoria">
                <select
                  value={currentItem.category}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      category: e.target.value,
                    })
                  }
                  className={dashboardSelectClassName}
                >
                  <option value="FOOD">Alimentação</option>
                  <option value="ACCESSORY">Acessórios</option>
                </select>
              </DashboardFormField>
              <DashboardFormField label="Preço (R$)">
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={currentItem.price}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, price: e.target.value })
                  }
                  className={dashboardInputClassName}
                />
              </DashboardFormField>
              <DashboardFormField label="Estoque">
                <input
                  type="number"
                  placeholder="0"
                  value={currentItem.stock}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, stock: e.target.value })
                  }
                  className={dashboardInputClassName}
                />
              </DashboardFormField>
              <DashboardFormField
                className="col-span-1 sm:col-span-2 lg:col-span-3"
                label="Descrição"
              >
                <input
                  type="text"
                  placeholder="Descrição do produto"
                  value={currentItem.description}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      description: e.target.value,
                    })
                  }
                  className={dashboardInputClassName}
                />
              </DashboardFormField>
            </DashboardFormGrid>
          </DashboardInlineForm>
        )}

        {loading ? (
          <TabLoadingState />
        ) : (
          <ResponsiveCollectionView
            items={filteredProducts}
            emptyLabel="Nenhum item encontrado."
            isEditing={isEditing}
            desktopHeaderRow={(
              <tr>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Preço</th>
                <th className="px-6 py-4">Estoque</th>
                <th className="px-6 py-4">Nível</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            )}
            renderMobileItem={(item) => {
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
                      <DashboardActionButton
                        icon="add_circle"
                        onClick={() => handleRestock(item.id, item.name)}
                        variant="mobile-muted"
                      />
                      <DashboardActionButton
                        icon="edit"
                        onClick={() => handleEdit(item)}
                        variant="mobile-muted"
                      />
                    </div>
                  </div>
                </div>
              );
            }}
            renderDesktopRow={(item) => {
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
                    <DashboardActionButton
                      icon="add_circle"
                      onClick={() => handleRestock(item.id, item.name)}
                      title="Repor (+10)"
                      variant="desktop-strong"
                    />
                    <DashboardActionButton
                      icon="edit"
                      onClick={() => handleEdit(item)}
                      title="Editar"
                      variant="desktop-muted"
                    />
                    <DashboardActionButton
                      icon="delete"
                      onClick={() => handleDelete(item.id, item.name)}
                      title="Excluir"
                      variant="desktop-danger"
                    />
                  </td>
                </tr>
              );
            }}
          />
        )}
      </DashboardCollectionPanel>
    </div>
  );
}
