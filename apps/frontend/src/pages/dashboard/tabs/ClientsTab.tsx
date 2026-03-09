import { useState } from "react";
import { dashboardService } from "../../../services/dashboardService";
import type { ApiClient } from "../../../services/dashboardService";
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
import { useClientsData } from "../hooks/useDashboardData";

interface ClientsTabProps {
  showToast: (message: string) => void;
  searchQuery?: string;
}

type ClientForm = {
  id?: string;
  name: string;
  email: string;
};

export default function ClientsTab({ showToast, searchQuery = "" }: ClientsTabProps) {
  const {
    clients,
    loading,
    removeClient,
    updateClientInList,
  } = useClientsData(showToast);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientForm>({ name: "", email: "" });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; clientId?: string; clientName?: string }>({ isOpen: false });

  const handleDelete = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, clientId: id, clientName: name });
  };

  const confirmDelete = async () => {
    if (!deleteModal.clientId) return;
    try {
      await dashboardService.deleteClient(deleteModal.clientId);
      removeClient(deleteModal.clientId);
      showToast(`Cliente ${deleteModal.clientName} removido.`);
    } catch {
      showToast("Falha ao excluir cliente.");
    }
    setDeleteModal({ isOpen: false });
  };

  const handleEdit = (client: ApiClient) => {
    setCurrentClient({ id: client.id, name: client.name, email: client.email });
    setIsEditing(true);
  };

  const saveClient = async () => {
    if (!currentClient.name || !currentClient.email) {
      showToast("Nome e E-mail são obrigatórios.");
      return;
    }
    if (!currentClient.id) return;
    try {
      const updated = await dashboardService.updateClient(currentClient.id, {
        name: currentClient.name,
        email: currentClient.email,
      });
      updateClientInList(currentClient.id, (currentClientItem) => ({
        ...currentClientItem,
        ...updated,
      }));
      showToast(`Cliente ${currentClient.name} atualizado!`);
      setIsEditing(false);
    } catch {
      showToast("Falha ao salvar cliente.");
    }
  };

  const genderGuess = (name: string): "male" | "female" =>
    name.toLowerCase().endsWith("a") ? "female" : "male";

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
      <TabSectionHeader
        title="Clientes"
        description="Gerencie o cadastro de tutores e seus dados."
      />

      <DashboardCollectionPanel isEditing={isEditing}>
        {isEditing && (
          <DashboardInlineForm
            minHeightClassName="min-h-[300px]"
            onCancel={() => setIsEditing(false)}
            onClose={() => setIsEditing(false)}
            onSubmit={saveClient}
            submitLabel="Salvar"
            title="Editar Cliente"
          >
            <DashboardFormGrid className="grid-cols-1 sm:grid-cols-2">
              <DashboardFormField label="Nome Completo">
                <input
                  type="text"
                  placeholder="Nome"
                  value={currentClient.name}
                  onChange={(e) =>
                    setCurrentClient({ ...currentClient, name: e.target.value })
                  }
                  className={dashboardInputClassName}
                />
              </DashboardFormField>
              <DashboardFormField label="E-mail">
                <input
                  type="email"
                  placeholder="E-mail"
                  value={currentClient.email}
                  onChange={(e) =>
                    setCurrentClient({
                      ...currentClient,
                      email: e.target.value,
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
            items={filteredClients}
            emptyLabel="Nenhum cliente encontrado."
            isEditing={isEditing}
            desktopHeaderRow={(
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Desde</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            )}
            renderMobileItem={(client) => (
              <div key={client.id} className="p-4 flex flex-col gap-3">
                <DashboardIdentity
                  avatarType="human"
                  gender={genderGuess(client.name)}
                  name={client.name}
                  size="md"
                  subtitle={client.email}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    Desde {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <div className="flex gap-2">
                    <DashboardActionButton
                      icon="edit"
                      onClick={() => handleEdit(client)}
                      variant="mobile-muted"
                    />
                    <DashboardActionButton
                      icon="delete"
                      onClick={() => handleDelete(client.id, client.name)}
                      variant="mobile-strong"
                    />
                  </div>
                </div>
              </div>
            )}
            renderDesktopRow={(client) => (
              <tr key={client.id} className="hover:bg-gray-50/50 transition-all duration-500 ease-in-out">
                <td className="px-6 py-4 font-medium text-primary">
                  <DashboardIdentity
                    avatarType="human"
                    gender={genderGuess(client.name)}
                    name={client.name}
                    size="sm"
                  />
                </td>
                <td className="px-6 py-4 text-gray-600">{client.email}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(client.createdAt).toLocaleDateString("pt-BR")}</td>
                <td className="px-6 py-4 text-right">
                  <DashboardActionButton
                    icon="edit"
                    onClick={() => handleEdit(client)}
                    title="Editar"
                    variant="desktop-muted"
                  />
                  <DashboardActionButton
                    icon="delete"
                    onClick={() => handleDelete(client.id, client.name)}
                    title="Excluir"
                    variant="desktop-danger"
                  />
                </td>
              </tr>
            )}
          />
        )}
      </DashboardCollectionPanel>

      <ConfirmationModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={confirmDelete} title="Excluir Cliente"
        message={`Deseja remover ${deleteModal.clientName}? Esta ação é irreversível.`}
        confirmText="Excluir" cancelText="Manter" variant="danger" />
    </div>
  );
}
