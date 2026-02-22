import { useState } from "react";

interface AppointmentsTabProps {
  showToast: (message: string) => void;
}

export default function AppointmentsTab({ showToast }: AppointmentsTabProps) {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      pet: "Bella",
      service: "Tosa Completa",
      time: "10:00",
      date: "Hoje",
      status: "Confirmado",
    },
    {
      id: 2,
      pet: "Max",
      service: "Check-up",
      time: "11:30",
      date: "Hoje",
      status: "Pendente",
    },
    {
      id: 3,
      pet: "Luna",
      service: "Vacinação",
      time: "14:00",
      date: "Hoje",
      status: "Confirmado",
    },
    {
      id: 4,
      pet: "Charlie",
      service: "Corte de Unhas",
      time: "15:15",
      date: "Hoje",
      status: "Concluído",
    },
    {
      id: 5,
      pet: "Thor",
      service: "Banho",
      time: "09:00",
      date: "Amanhã",
      status: "Confirmado",
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentApp, setCurrentApp] = useState({
    id: 0,
    pet: "",
    service: "",
    time: "",
    date: "Hoje",
    status: "Pendente",
  });

  const handleComplete = (id: number, pet: string) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "Concluído" } : app,
      ),
    );
    showToast(`Agendamento de ${pet} marcado como Concluído!`);
  };

  const handleCancel = (id: number, pet: string) => {
    setAppointments((prev) => prev.filter((app) => app.id !== id));
    showToast(`Agendamento de ${pet} cancelado e removido da lista.`);
  };

  const handleNew = () => {
    setCurrentApp({
      id: 0,
      pet: "",
      service: "",
      time: "",
      date: "Hoje",
      status: "Pendente",
    });
    setIsEditing(true);
  };

  const saveAppointment = () => {
    if (!currentApp.pet || !currentApp.service || !currentApp.time) {
      showToast("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (currentApp.id > 0) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === currentApp.id ? currentApp : a)),
      );
      showToast(`Agendamento de ${currentApp.pet} atualizado!`);
    } else {
      const newId = appointments.length > 0 ? Math.max(...appointments.map((a) => a.id)) + 1 : 1;
      setAppointments((prev) => [...prev, { ...currentApp, id: newId }]);
      showToast(`Agendamento para ${currentApp.pet} criado com sucesso!`);
    }
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">
            Agendamentos
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Controle a agenda de serviços do petshop.
          </p>
        </div>
        <button
          onClick={handleNew}
          className="bg-primary text-white px-4 py-2.5 md:py-2 rounded-lg text-sm font-medium hover:bg-[#4d4d4d] transition-all duration-500 ease-in-out flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">
            calendar_add_on
          </span>
          Novo Agendamento
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm overflow-hidden relative">
        {isEditing && (
          <div className="absolute inset-0 bg-white/95 z-20 flex flex-col p-6 backdrop-blur-sm animate-in fade-in">
            <h2 className="text-lg font-bold text-primary mb-4">Novo Agendamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Nome do Pet</label>
                <input
                  type="text"
                  placeholder="Ex: Bella"
                  value={currentApp.pet}
                  onChange={(e) => setCurrentApp({ ...currentApp, pet: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded p-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Serviço</label>
                <input
                  type="text"
                  placeholder="Ex: Banho e Tosa"
                  value={currentApp.service}
                  onChange={(e) => setCurrentApp({ ...currentApp, service: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded p-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Data</label>
                <input
                  type="text"
                  placeholder="Hoje, Amanhã ou Data"
                  value={currentApp.date}
                  onChange={(e) => setCurrentApp({ ...currentApp, date: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded p-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Horário</label>
                <input
                  type="text"
                  placeholder="Ex: 14:30"
                  value={currentApp.time}
                  onChange={(e) => setCurrentApp({ ...currentApp, time: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded p-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-auto">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={saveAppointment}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-black rounded"
              >
                Salvar Agendamento
              </button>
            </div>
          </div>
        )}

        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-[#e5e5e5]">
          {appointments.map((app) => (
            <div key={app.id} className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-primary">{app.pet}</h3>
                  <p className="text-xs text-gray-500">{app.service}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${app.status === "Confirmado"
                    ? "bg-neutral-200 border border-neutral-300 text-neutral-900 font-bold"
                    : app.status === "Pendente"
                      ? "bg-white border border-neutral-300 border-dashed text-neutral-600 italic"
                      : app.status === "Concluído"
                        ? "bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold"
                        : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {app.status}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-600 font-mono">
                  {app.date} às {app.time}
                </div>
                <div className="flex gap-2">
                  {app.status !== "Concluído" && (
                    <button
                      onClick={() => handleComplete(app.id, app.pet)}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold border border-neutral-300"
                    >
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleCancel(app.id, app.pet)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-900 text-white text-white border border-neutral-900"
                  >
                    <span className="material-symbols-outlined text-lg">cancel</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-[#e5e5e5] text-xs uppercase text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Pet</th>
                <th className="px-6 py-4">Serviço</th>
                <th className="px-6 py-4">Data/Hora</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {appointments.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-gray-50/50 transition-all duration-500 ease-in-out"
                >
                  <td className="px-6 py-4 font-medium text-primary">
                    {app.pet}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{app.service}</td>
                  <td className="px-6 py-4 text-gray-600 font-mono">
                    {app.date} às {app.time}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${app.status === "Confirmado"
                        ? "bg-neutral-200 border border-neutral-300 text-neutral-900 font-bold"
                        : app.status === "Pendente"
                          ? "bg-white border border-neutral-300 border-dashed text-neutral-600 italic"
                          : app.status === "Concluído"
                            ? "bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleComplete(app.id, app.pet)}
                      className="text-neutral-800 font-bold hover:text-green-700 transition-all duration-500 ease-in-out p-1"
                      title="Concluir"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        check_circle
                      </span>
                    </button>
                    <button
                      onClick={() => handleCancel(app.id, app.pet)}
                      className="text-white hover:text-white transition-all duration-500 ease-in-out p-1 ml-2"
                      title="Cancelar"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        cancel
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
