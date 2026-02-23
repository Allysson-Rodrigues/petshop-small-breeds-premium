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
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">
            Clientes
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Gerencie o cadastro de tutores e seus dados.
          </p>
        </div>
        <button
          onClick={handleNew}
          className="bg-primary text-white px-4 py-2.5 md:py-2 rounded-lg text-sm font-medium hover:bg-[#4d4d4d] transition-all duration-500 ease-in-out flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Novo Cliente
        </button>
      </div>

      <div className={`bg-white rounded-xl border border-[#e5e5e5] shadow-sm relative ${isEditing ? 'min-h-[500px]' : 'overflow-hidden'} transition-all duration-300`}>
        {isEditing && (
          <div className="absolute inset-0 bg-white/95 z-10 flex flex-col p-6 backdrop-blur-sm animate-in fade-in overflow-y-auto">
            <h2 className="text-lg font-bold text-primary mb-4">
              {currentClient.id ? "Editar Cliente" : "Novo Cliente"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <label htmlFor="clientName">Nome Completo</label>
              <input
                id="clientName"
                type="text"
                placeholder="Nome Completo"
                aria-label="Nome Completo"
                value={currentClient.name}
                onChange={(e) =>
                  setCurrentClient({ ...currentClient, name: e.target.value })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm"
              />
              <label htmlFor="clientEmail">E-mail</label>
              <input
                id="clientEmail"
                type="email"
                placeholder="E-mail"
                aria-label="E-mail"
                value={currentClient.email}
                onChange={(e) =>
                  setCurrentClient({
                    ...currentClient,
                    email: e.target.value,
                  })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm"
              />
              <label htmlFor="clientPhone">Telefone</label>
              <input
                id="clientPhone"
                type="text"
                placeholder="Telefone"
                aria-label="Telefone"
                value={currentClient.phone}
                onChange={(e) =>
                  setCurrentClient({
                    ...currentClient,
                    phone: e.target.value,
                  })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm"
              />
              <label htmlFor="clientPets">Qtde de Pets</label>
              <input
                id="clientPets"
                type="number"
                placeholder="Qtde de Pets"
                aria-label="Quantidade de Pets"
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
            <div className="flex justify-end gap-3 mt-auto pt-6 border-t border-gray-100">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={saveClient}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-black"
              >
                Salvar
              </button>
            </div>
          </div>
        )}

        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-[#e5e5e5]">
          {filteredClients.map((client) => (
            <div key={client.id} className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-primary">{client.name}</h3>
                  <p className="text-xs text-gray-500">{client.email}</p>
                </div>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-200 border border-neutral-300 text-neutral-900 font-bold font-medium text-xs">
                  {client.pets}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-600">
                  {client.phone}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 border border-gray-100"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(client.id!, client.name)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-900 text-white text-white border border-neutral-900"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredClients.length === 0 && !isEditing && (
            <div className="p-8 text-center text-gray-500">
              Nenhum cliente encontrado.
            </div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
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
                  className="hover:bg-gray-50/50 transition-all duration-500 ease-in-out"
                >
                  <td className="px-6 py-4 font-medium text-primary">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{client.email}</td>
                  <td className="px-6 py-4 text-gray-600">{client.phone}</td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-200 border border-neutral-300 text-neutral-900 font-bold font-medium text-xs">
                      {client.pets}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-gray-400 hover:text-primary transition-all duration-500 ease-in-out p-1"
                      title="Editar"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(client.id!, client.name)}
                      className="text-gray-400 hover:text-red-500 transition-all duration-500 ease-in-out p-1 ml-2"
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
