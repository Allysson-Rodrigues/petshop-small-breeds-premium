import { useState } from "react";
import { dashboardService, type ApiPet } from "../../../services/dashboardService";
import ConfirmationModal from "../components/ConfirmationModal";
import { DashboardActionButton } from "../components/DashboardActionButton";
import {
  DashboardCollectionPanel,
  DashboardFormField,
  DashboardFormGrid,
  DashboardInlineForm,
  dashboardInputClassName,
} from "../components/DashboardForm";
import { DashboardIdentity } from "../components/DashboardIdentity";
import { ResponsiveCollectionView } from "../components/ResponsiveCollectionView";
import { TabSectionHeader } from "../components/TabSectionHeader";
import { TabLoadingState } from "../components/TabState";
import { usePetsData } from "../hooks/useDashboardData";

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
  const { addPet, loading, pets, removePet, updatePetInList } = usePetsData(showToast);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPet, setCurrentPet] = useState<PetForm>({ name: "", breed: "", age: "" });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; petId?: string; petName?: string }>({ isOpen: false });

  const handleDelete = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, petId: id, petName: name });
  };

  const confirmDelete = async () => {
    if (!deleteModal.petId) return;
    try {
      await dashboardService.deletePet(deleteModal.petId);
      removePet(deleteModal.petId);
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
        updatePetInList(currentPet.id, () => updated);
        showToast(`Pet ${currentPet.name} atualizado!`);
      } else {
        const created = await dashboardService.createPet({
          name: currentPet.name,
          breed: currentPet.breed,
          age: Number(currentPet.age) || 0,
        });
        addPet(created);
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

      <DashboardCollectionPanel isEditing={isEditing}>
        {isEditing && (
          <DashboardInlineForm
            onCancel={() => setIsEditing(false)}
            onClose={() => setIsEditing(false)}
            onSubmit={savePet}
            submitLabel="Salvar Pet"
            title={currentPet.id ? "Editar Pet" : "Novo Pet"}
          >
            <DashboardFormGrid className="grid-cols-1 sm:grid-cols-2">
              <DashboardFormField label="Nome do Pet">
                <input
                  type="text"
                  placeholder="Nome do Pet"
                  value={currentPet.name}
                  onChange={(e) =>
                    setCurrentPet({ ...currentPet, name: e.target.value })
                  }
                  className={dashboardInputClassName}
                />
              </DashboardFormField>
              <DashboardFormField label="Raça">
                <input
                  type="text"
                  placeholder="Raça"
                  value={currentPet.breed}
                  onChange={(e) =>
                    setCurrentPet({ ...currentPet, breed: e.target.value })
                  }
                  className={dashboardInputClassName}
                />
              </DashboardFormField>
              <DashboardFormField label="Idade (anos)">
                <input
                  type="number"
                  placeholder="0"
                  value={currentPet.age}
                  onChange={(e) =>
                    setCurrentPet({ ...currentPet, age: e.target.value })
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
            items={filteredPets}
            emptyLabel="Nenhum pet encontrado."
            isEditing={isEditing}
            desktopHeaderRow={(
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Raça</th>
                <th className="px-6 py-4">Idade</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            )}
            renderMobileItem={(pet) => (
              <div key={pet.id} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <DashboardIdentity
                    avatarType="pet"
                    breed={pet.breed}
                    name={pet.name}
                    size="md"
                    subtitle={pet.breed}
                  />
                  <span className="text-xs text-gray-400">{pet.age} {pet.age === 1 ? "ano" : "anos"}</span>
                </div>
                <div className="flex justify-end gap-2">
                  <DashboardActionButton
                    icon="edit"
                    onClick={() => handleEdit(pet)}
                    variant="mobile-muted"
                  />
                  <DashboardActionButton
                    icon="delete"
                    onClick={() => handleDelete(pet.id, pet.name)}
                    variant="mobile-strong"
                  />
                </div>
              </div>
            )}
            renderDesktopRow={(pet) => (
              <tr key={pet.id} className="hover:bg-gray-50/50 transition-all duration-500 ease-in-out">
                <td className="px-6 py-4 font-medium text-primary">
                  <DashboardIdentity
                    avatarType="pet"
                    breed={pet.breed}
                    name={pet.name}
                    size="sm"
                  />
                </td>
                <td className="px-6 py-4 text-gray-600">{pet.breed}</td>
                <td className="px-6 py-4 text-gray-600">{pet.age} {pet.age === 1 ? "ano" : "anos"}</td>
                <td className="px-6 py-4 text-right">
                  <DashboardActionButton
                    icon="edit"
                    onClick={() => handleEdit(pet)}
                    title="Editar"
                    variant="desktop-muted"
                  />
                  <DashboardActionButton
                    icon="delete"
                    onClick={() => handleDelete(pet.id, pet.name)}
                    title="Excluir"
                    variant="desktop-danger"
                  />
                </td>
              </tr>
            )}
          />
        )}
      </DashboardCollectionPanel>

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
