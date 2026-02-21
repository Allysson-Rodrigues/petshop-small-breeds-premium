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

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Agendamentos
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Controle a agenda de serviços do petshop.
          </p>
        </div>
        <button
          onClick={() => showToast("Modal de Novo Agendamento aberto.")}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4d4d4d] transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">
            calendar_add_on
          </span>
          Novo Agendamento
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
                  className="hover:bg-gray-50/50 transition-colors"
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
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        app.status === "Confirmado"
                          ? "bg-blue-100 text-blue-800"
                          : app.status === "Pendente"
                            ? "bg-yellow-100 text-yellow-800"
                            : app.status === "Concluído"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleComplete(app.id, app.pet)}
                      className="text-green-500 hover:text-green-700 transition-colors p-1"
                      title="Concluir"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        check_circle
                      </span>
                    </button>
                    <button
                      onClick={() => handleCancel(app.id, app.pet)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1 ml-2"
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
