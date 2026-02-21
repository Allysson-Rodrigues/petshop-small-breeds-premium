import { useState } from "react";

interface ClientsTabProps {
  showToast: (message: string) => void;
  searchQuery?: string;
}

type ClientData = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  pets: number;
};

export default function ClientsTab({
  showToast,
  searchQuery = "",
}: ClientsTabProps) {
  const [clients, setClients] = useState<ClientData[]>([
    {
      id: 1,
      name: "Ana Souza",
      email: "ana.souza@email.com",
      phone: "(11) 98765-4321",
      pets: 2,
    },
    {
      id: 2,
      name: "Carlos Pereira",
      email: "carlos.p@email.com",
      phone: "(11) 91234-5678",
      pets: 1,
    },
    {
      id: 3,
      name: "Mariana Silva",
      email: "mari.silva@email.com",
      phone: "(21) 99876-1234",
      pets: 3,
    },
    {
      id: 4,
      name: "João Mendes",
      email: "joao.mendes@email.com",
      phone: "(31) 94567-8901",
      pets: 1,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientData>({
    name: "",
    email: "",
    phone: "",
    pets: 1,
  });

  const handleDelete = (id: number, name: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
    showToast(`Cliente ${name} removido do sistema.`);
  };

  const handleEdit = (client: ClientData) => {
    setCurrentClient(client);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentClient({ name: "", email: "", phone: "", pets: 1 });
    setIsEditing(true);
  };

  const saveClient = () => {
    if (!currentClient.name || !currentClient.email) {
      showToast("Nome e E-mail são obrigatórios.");
      return;
    }

    if (currentClient.id) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === currentClient.id ? (currentClient as ClientData) : c,
        ),
      );
      showToast(`Cliente ${currentClient.name} atualizado!`);
    } else {
      const newId =
        clients.length > 0 ? Math.max(...clients.map((c) => c.id || 0)) + 1 : 1;
      setClients((prev) => [
        ...prev,
        { ...currentClient, id: newId } as ClientData,
      ]);
      showToast(`Cliente ${currentClient.name} cadastrado com sucesso!`);
    }
    setIsEditing(false);
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Clientes
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gerencie o cadastro de tutores e seus dados.
          </p>
        </div>
        <button
          onClick={handleNew}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4d4d4d] transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm overflow-hidden relative">
        {isEditing && (
          <div className="absolute inset-0 bg-white/95 z-10 flex flex-col p-6 backdrop-blur-sm animate-in fade-in">
            <h2 className="text-lg font-bold text-primary mb-4">
              {currentClient.id ? "Editar Cliente" : "Novo Cliente"}
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nome Completo"
                value={currentClient.name}
                onChange={(e) =>
                  setCurrentClient({ ...currentClient, name: e.target.value })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm"
              />
              <input
                type="email"
                placeholder="E-mail"
                value={currentClient.email}
                onChange={(e) =>
                  setCurrentClient({ ...currentClient, email: e.target.value })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm"
              />
              <input
                type="text"
                placeholder="Telefone"
                value={currentClient.phone}
                onChange={(e) =>
                  setCurrentClient({ ...currentClient, phone: e.target.value })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm"
              />
              <input
                type="number"
                placeholder="Qtde de Pets"
                value={currentClient.pets}
                onChange={(e) =>
                  setCurrentClient({
                    ...currentClient,
                    pets: Number(e.target.value),
                  })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 mt-auto">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={saveClient}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-black rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-[#e5e5e5] text-xs uppercase text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Telefone</th>
                <th className="px-6 py-4 text-center">Total de Pets</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-primary">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{client.email}</td>
                  <td className="px-6 py-4 text-gray-600">{client.phone}</td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-medium text-xs">
                      {client.pets}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-gray-400 hover:text-primary transition-colors p-1"
                      title="Editar"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(client.id!, client.name)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1 ml-2"
                      title="Excluir"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClients.length === 0 && !isEditing && (
            <div className="p-8 text-center text-gray-500">
              Nenhum cliente encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
