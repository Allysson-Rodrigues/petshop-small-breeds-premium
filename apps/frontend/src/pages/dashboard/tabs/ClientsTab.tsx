/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { dashboardService, type ApiClient } from "../../../services/dashboardService";
import ConfirmationModal from "../components/ConfirmationModal";
import NotionAvatar from "../components/NotionAvatar";
import { TabSectionHeader } from "../components/TabSectionHeader";
import { TabEmptyState, TabLoadingState } from "../components/TabState";

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
  const [clients, setClients] = useState<ApiClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientForm>({ name: "", email: "" });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; clientId?: string; clientName?: string }>({ isOpen: false });

  const fetchClients = () => {
    setLoading(true);
    dashboardService
      .getClients()
      .then(setClients)
      .catch(() => showToast("Falha ao carregar clientes."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchClients(); }, []);

  const handleDelete = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, clientId: id, clientName: name });
  };

  const confirmDelete = async () => {
    if (!deleteModal.clientId) return;
    try {
      await dashboardService.deleteClient(deleteModal.clientId);
      setClients((prev) => prev.filter((c) => c.id !== deleteModal.clientId));
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
      setClients((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
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

      <div className={`bg-white rounded-2xl border border-[#e5e5e5] shadow-sm relative transition-all duration-300 ${isEditing ? "border-primary/20 shadow-md" : "overflow-hidden"}`}>
        {isEditing && (
          <div className="bg-white/98 z-10 flex flex-col p-6 md:p-8 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300 rounded-2xl min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary">Editar Cliente</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-primary transition-colors" title="Fechar">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Nome Completo</label>
                <input type="text" placeholder="Nome" value={currentClient.name}
                  onChange={(e) => setCurrentClient({ ...currentClient, name: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/30" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">E-mail</label>
                <input type="email" placeholder="E-mail" value={currentClient.email}
                  onChange={(e) => setCurrentClient({ ...currentClient, email: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/30" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 pt-6 border-t border-gray-100">
              <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors order-2 sm:order-1">Cancelar</button>
              <button onClick={saveClient} className="bg-neutral-900 text-white px-10 py-3 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all shadow-lg shadow-black/10 order-1 sm:order-2 active:scale-[0.98]">Salvar</button>
            </div>
          </div>
        )}

        {loading ? (
          <TabLoadingState />
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden divide-y divide-[#e5e5e5]">
              {filteredClients.map((client) => (
                <div key={client.id} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <NotionAvatar name={client.name} gender={genderGuess(client.name)} type="human" size="md" />
                      <div>
                        <h3 className="font-bold text-primary">{client.name}</h3>
                        <p className="text-xs text-gray-500">{client.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      Desde {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(client)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 border border-gray-100">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button onClick={() => handleDelete(client.id, client.name)} className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-900 text-white border border-neutral-900">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredClients.length === 0 && !isEditing && (
                <TabEmptyState label="Nenhum cliente encontrado." />
              )}
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e5e5] text-xs uppercase text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Desde</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5]">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50/50 transition-all duration-500 ease-in-out">
                      <td className="px-6 py-4 font-medium text-primary">
                        <div className="flex items-center gap-3">
                          <NotionAvatar name={client.name} gender={genderGuess(client.name)} type="human" size="sm" />
                          {client.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{client.email}</td>
                      <td className="px-6 py-4 text-gray-600">{new Date(client.createdAt).toLocaleDateString("pt-BR")}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEdit(client)} className="text-gray-400 hover:text-primary transition-all p-1" title="Editar">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(client.id, client.name)} className="text-gray-400 hover:text-red-500 transition-all p-1 ml-2" title="Excluir">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredClients.length === 0 && !isEditing && (
                <TabEmptyState label="Nenhum cliente encontrado." />
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmationModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={confirmDelete} title="Excluir Cliente"
        message={`Deseja remover ${deleteModal.clientName}? Esta ação é irreversível.`}
        confirmText="Excluir" cancelText="Manter" variant="danger" />
    </div>
  );
}
