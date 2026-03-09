import { useEffect, useState } from "react";
import { dashboardService, type ApiPet } from "../../../services/dashboardService";
import ConfirmationModal from "../components/ConfirmationModal";
import NotionAvatar from "../components/NotionAvatar";
import { TabSectionHeader } from "../components/TabSectionHeader";
import { TabEmptyState, TabLoadingState } from "../components/TabState";

interface PetsTabProps {
  showToast: (message: string) => void;
  searchQuery?: string;
}

type PetForm = {
  id?: string;
  name: string;
  breed: string;
  age: string;
};

export default function PetsTab({ showToast, searchQuery = "" }: PetsTabProps) {
  const [pets, setPets] = useState<ApiPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPet, setCurrentPet] = useState<PetForm>({ name: "", breed: "", age: "" });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; petId?: string; petName?: string }>({ isOpen: false });

  const fetchPets = () => {
    setLoading(true);
    dashboardService
      .getPets()
      .then(setPets)
      .catch(() => showToast("Falha ao carregar pets."))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchPets(); }, []);

  const handleDelete = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, petId: id, petName: name });
  };

  const confirmDelete = async () => {
    if (!deleteModal.petId) return;
    try {
      await dashboardService.deletePet(deleteModal.petId);
      setPets((prev) => prev.filter((p) => p.id !== deleteModal.petId));
      showToast(`Pet ${deleteModal.petName} removido.`);
    } catch {
      showToast("Falha ao excluir pet.");
    }
    setDeleteModal({ isOpen: false });
  };

  const handleEdit = (pet: ApiPet) => {
    setCurrentPet({ id: pet.id, name: pet.name, breed: pet.breed, age: String(pet.age) });
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentPet({ name: "", breed: "", age: "" });
    setIsEditing(true);
  };

  const savePet = async () => {
    if (!currentPet.name || !currentPet.breed) {
      showToast("Nome e Raça são obrigatórios.");
      return;
    }
    try {
      if (currentPet.id) {
        const updated = await dashboardService.updatePet(currentPet.id, {
          name: currentPet.name,
          breed: currentPet.breed,
          age: Number(currentPet.age) || 0,
        });
        setPets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        showToast(`Pet ${currentPet.name} atualizado!`);
      } else {
        const created = await dashboardService.createPet({
          name: currentPet.name,
          breed: currentPet.breed,
          age: Number(currentPet.age) || 0,
        });
        setPets((prev) => [...prev, created]);
        showToast(`Pet ${currentPet.name} cadastrado!`);
      }
      setIsEditing(false);
    } catch {
      showToast("Falha ao salvar pet.");
    }
  };

  const filteredPets = pets.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.breed.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
      <TabSectionHeader
        title="Pets"
        description="Gerencie os animais cadastrados e seus prontuários."
        action={
          <button
            onClick={handleNew}
            className="bg-neutral-900 text-white pl-4 pr-5 py-2.5 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2 w-full md:w-auto shadow-lg shadow-black/10 active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Novo Pet
          </button>
        }
      />

      <div className={`bg-white rounded-2xl border border-[#e5e5e5] shadow-sm relative transition-all duration-300 ${isEditing ? "border-primary/20 shadow-md" : "overflow-hidden"}`}>
        {isEditing && (
          <div className="bg-white/98 z-10 flex flex-col p-6 md:p-8 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300 rounded-2xl min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary">
                {currentPet.id ? "Editar Pet" : "Novo Pet"}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-primary transition-colors" title="Fechar">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Nome do Pet</label>
                <input type="text" placeholder="Nome do Pet" value={currentPet.name}
                  onChange={(e) => setCurrentPet({ ...currentPet, name: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/30" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Raça</label>
                <input type="text" placeholder="Raça" value={currentPet.breed}
                  onChange={(e) => setCurrentPet({ ...currentPet, breed: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/30" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Idade (anos)</label>
                <input type="number" placeholder="0" value={currentPet.age}
                  onChange={(e) => setCurrentPet({ ...currentPet, age: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/30" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 pt-6 border-t border-gray-100">
              <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors order-2 sm:order-1">
                Cancelar
              </button>
              <button onClick={savePet} className="bg-neutral-900 text-white px-10 py-3 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all shadow-lg shadow-black/10 order-1 sm:order-2 active:scale-[0.98]">
                Salvar Pet
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <TabLoadingState />
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="md:hidden divide-y divide-[#e5e5e5]">
              {filteredPets.map((pet) => (
                <div key={pet.id} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <NotionAvatar name={pet.name} breed={pet.breed} type="pet" size="md" />
                      <div>
                        <h3 className="font-bold text-primary">{pet.name}</h3>
                        <p className="text-xs text-gray-500">{pet.breed}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{pet.age} {pet.age === 1 ? "ano" : "anos"}</span>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(pet)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 border border-gray-100">
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button onClick={() => handleDelete(pet.id, pet.name)} className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-900 text-white border border-neutral-900">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))}
              {filteredPets.length === 0 && !isEditing && (
                <TabEmptyState label="Nenhum pet encontrado." />
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e5e5] text-xs uppercase text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">Raça</th>
                    <th className="px-6 py-4">Idade</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5]">
                  {filteredPets.map((pet) => (
                    <tr key={pet.id} className="hover:bg-gray-50/50 transition-all duration-500 ease-in-out">
                      <td className="px-6 py-4 font-medium text-primary">
                        <div className="flex items-center gap-3">
                          <NotionAvatar name={pet.name} breed={pet.breed} type="pet" size="sm" />
                          {pet.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{pet.breed}</td>
                      <td className="px-6 py-4 text-gray-600">{pet.age} {pet.age === 1 ? "ano" : "anos"}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEdit(pet)} className="text-gray-400 hover:text-primary transition-all p-1" title="Editar">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(pet.id, pet.name)} className="text-gray-400 hover:text-red-500 transition-all p-1 ml-2" title="Excluir">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPets.length === 0 && !isEditing && (
                <TabEmptyState label="Nenhum pet encontrado." />
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={confirmDelete}
        title="Excluir Pet"
        message={`Deseja realmente remover ${deleteModal.petName}? Esta ação é irreversível.`}
        confirmText="Excluir"
        cancelText="Manter"
        variant="danger"
      />
    </div>
  );
}
