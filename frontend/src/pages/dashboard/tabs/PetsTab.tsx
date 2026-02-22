import { useState } from "react";

interface PetsTabProps {
  showToast: (message: string) => void;
  searchQuery?: string;
}

type PetData = {
  id?: number;
  name: string;
  species: string;
  breed: string;
  age: string;
  owner: string;
  status: string;
};

export default function PetsTab({ showToast, searchQuery = "" }: PetsTabProps) {
  const [pets, setPets] = useState<PetData[]>([
    {
      id: 1,
      name: "Bella",
      species: "Cachorro",
      breed: "Golden Retriever",
      age: "2 anos",
      owner: "Ana Souza",
      status: "Saudável",
    },
    {
      id: 2,
      name: "Max",
      species: "Cachorro",
      breed: "French Bulldog",
      age: "1 ano",
      owner: "Carlos Pereira",
      status: "Vacinação Pendente",
    },
    {
      id: 3,
      name: "Luna",
      species: "Gato",
      breed: "Persa",
      age: "3 anos",
      owner: "Mariana Silva",
      status: "Saudável",
    },
    {
      id: 4,
      name: "Charlie",
      species: "Cachorro",
      breed: "Vira-lata",
      age: "4 anos",
      owner: "João Mendes",
      status: "Check-up Necessário",
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentPet, setCurrentPet] = useState<PetData>({
    name: "",
    species: "",
    breed: "",
    age: "",
    owner: "",
    status: "Saudável",
  });

  const handleDelete = (id: number, name: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id));
    showToast(`Registro do pet ${name} foi excluído.`);
  };

  const handleEdit = (pet: PetData) => {
    setCurrentPet(pet);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentPet({
      name: "",
      species: "",
      breed: "",
      age: "",
      owner: "",
      status: "Saudável",
    });
    setIsEditing(true);
  };

  const savePet = () => {
    if (!currentPet.name || !currentPet.owner) {
      showToast("Nome do Pet e Tutor são obrigatórios.");
      return;
    }

    if (currentPet.id) {
      setPets((prev) =>
        prev.map((p) => (p.id === currentPet.id ? (currentPet as PetData) : p)),
      );
      showToast(`Prontuário de ${currentPet.name} atualizado!`);
    } else {
      const newId =
        pets.length > 0 ? Math.max(...pets.map((p) => p.id || 0)) + 1 : 1;
      setPets((prev) => [...prev, { ...currentPet, id: newId } as PetData]);
      showToast(`Pet ${currentPet.name} cadastrado com sucesso!`);
    }
    setIsEditing(false);
  };

  const filteredPets = pets.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.owner.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">
            Pets
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Gerencie os animais cadastrados e seus prontuários.
          </p>
        </div>
        <button
          onClick={handleNew}
          className="bg-primary text-white px-4 py-2.5 md:py-2 rounded-lg text-sm font-medium hover:bg-[#4d4d4d] transition-all duration-500 ease-in-out flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Novo Pet
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm overflow-hidden relative">
        {isEditing && (
          <div className="absolute inset-0 bg-white/95 z-10 flex flex-col p-6 backdrop-blur-sm animate-in fade-in">
            <h2 className="text-lg font-bold text-primary mb-4">
              {currentPet.id ? "Editar Pet" : "Novo Pet"}
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label className="sr-only">Nome do Pet</label>
              <input
                type="text"
                placeholder="Nome do Pet"
                aria-label="Nome do Pet"
                value={currentPet.name}
                onChange={(e) =>
                  setCurrentPet({ ...currentPet, name: e.target.value })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm"
              />
              <label className="sr-only">Espécie</label>
              <input
                type="text"
                placeholder="Espécie (Cachorro, Gato...)"
                aria-label="Espécie"
                value={currentPet.species}
                onChange={(e) =>
                  setCurrentPet({ ...currentPet, species: e.target.value })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm"
              />
              <label className="sr-only">Raça</label>
              <input
                type="text"
                placeholder="Raça"
                aria-label="Raça"
                value={currentPet.breed}
                onChange={(e) =>
                  setCurrentPet({ ...currentPet, breed: e.target.value })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm"
              />
              <label className="sr-only">Idade</label>
              <input
                type="text"
                placeholder="Idade"
                aria-label="Idade"
                value={currentPet.age}
                onChange={(e) =>
                  setCurrentPet({ ...currentPet, age: e.target.value })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm"
              />
              <label className="sr-only">Tutor</label>
              <input
                type="text"
                placeholder="Tutor"
                aria-label="Tutor"
                value={currentPet.owner}
                onChange={(e) =>
                  setCurrentPet({ ...currentPet, owner: e.target.value })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm"
              />
              <select
                value={currentPet.status}
                onChange={(e) =>
                  setCurrentPet({ ...currentPet, status: e.target.value })
                }
                className="border border-[#e5e5e5] rounded p-2 text-sm bg-white"
              >
                <option value="Saudável">Saudável</option>
                <option value="Vacinação Pendente">Vacinação Pendente</option>
                <option value="Check-up Necessário">Check-up Necessário</option>
                <option value="Em Tratamento">Em Tratamento</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-auto">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={savePet}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-black rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        )}

        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-[#e5e5e5]">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-primary">{pet.name}</h3>
                  <p className="text-xs text-gray-500">
                    {pet.species} • {pet.breed}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${pet.status === "Saudável"
                      ? "bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold"
                      : pet.status === "Vacinação Pendente"
                        ? "bg-white border border-neutral-300 border-dashed text-neutral-600 italic"
                        : "bg-neutral-600 text-white text-white"
                    }`}
                >
                  {pet.status}
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div className="text-xs text-gray-600">
                  <p>
                    <span className="font-medium">Idade:</span> {pet.age}
                  </p>
                  <p>
                    <span className="font-medium">Tutor:</span> {pet.owner}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(pet)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 border border-gray-100"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(pet.id!, pet.name)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-900 text-white text-white border border-neutral-900"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredPets.length === 0 && !isEditing && (
            <div className="p-8 text-center text-gray-500">
              Nenhum pet encontrado.
            </div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-[#e5e5e5] text-xs uppercase text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Espécie / Raça</th>
                <th className="px-6 py-4">Idade</th>
                <th className="px-6 py-4">Tutor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {filteredPets.map((pet) => (
                <tr
                  key={pet.id}
                  className="hover:bg-gray-50/50 transition-all duration-500 ease-in-out"
                >
                  <td className="px-6 py-4 font-medium text-primary">
                    {pet.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex flex-col">
                      <span>{pet.species}</span>
                      <span className="text-xs text-gray-400">{pet.breed}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{pet.age}</td>
                  <td className="px-6 py-4 text-gray-600">{pet.owner}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${pet.status === "Saudável"
                          ? "bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold"
                          : pet.status === "Vacinação Pendente"
                            ? "bg-white border border-neutral-300 border-dashed text-neutral-600 italic"
                            : "bg-neutral-600 text-white text-white"
                        }`}
                    >
                      {pet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(pet)}
                      className="text-gray-400 hover:text-primary transition-all duration-500 ease-in-out p-1"
                      title="Editar"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(pet.id!, pet.name)}
                      className="text-white hover:text-white transition-all duration-500 ease-in-out p-1 ml-2"
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
          {filteredPets.length === 0 && !isEditing && (
            <div className="p-8 text-center text-gray-500">
              Nenhum pet encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
