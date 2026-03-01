import { useEffect, useState } from "react";
import { dashboardService, type DashboardData } from "../../../services/dashboardService";
import NotionAvatar from "../components/NotionAvatar";

interface OverviewTabProps {
  showToast: (message: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function OverviewTab({ showToast, setActiveTab }: OverviewTabProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    dashboardService
      .getDashboard()
      .then(setData)
      .catch(() => showToast("Falha ao carregar dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const totalPets = data?.stats.totalPets ?? 0;
  const totalAppointments = data?.stats.totalAppointments ?? 0;
  const nextAppointment = data?.stats.nextAppointment;

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
      {/* Page Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">
          Visão Geral do Painel
        </h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1">
          Bem-vindo de volta, veja o que está acontecendo hoje.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-400 text-sm animate-pulse">
          Carregando dados...
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Total Pets */}
            <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e5e5e5] shadow-sm flex flex-col justify-between h-28 md:h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-5xl md:text-6xl text-primary">
                  pets
                </span>
              </div>
              <p className="text-gray-500 text-xs md:text-sm font-medium">Total de Pets</p>
              <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">{totalPets}</h2>
            </div>

            {/* Total Appointments */}
            <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e5e5e5] shadow-sm flex flex-col justify-between h-28 md:h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-5xl md:text-6xl text-primary">
                  event_available
                </span>
              </div>
              <p className="text-gray-500 text-xs md:text-sm font-medium">Agendamentos</p>
              <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">{totalAppointments}</h2>
            </div>

            {/* Next Appointment */}
            <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e5e5e5] shadow-sm flex flex-col justify-between h-28 md:h-32 relative overflow-hidden group hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-5xl md:text-6xl text-primary">
                  schedule
                </span>
              </div>
              <p className="text-gray-500 text-xs md:text-sm font-medium">Próximo Agendamento</p>
              <h2 className="text-lg md:text-xl font-bold text-primary tracking-tight">
                {nextAppointment
                  ? new Date(nextAppointment.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Nenhum"}
              </h2>
            </div>
          </div>

          {/* Recent Pets */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Pets Cadastrados</h2>
              <button
                className="text-sm font-medium text-gray-500 hover:text-primary transition-all duration-500 ease-in-out flex items-center gap-1"
                onClick={() => setActiveTab("pets")}
              >
                Ver todos{" "}
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
            <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm overflow-hidden">
              {data?.pets && data.pets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left min-w-[400px] md:min-w-0">
                    <thead className="bg-gray-50 border-b border-[#e5e5e5] text-xs uppercase text-gray-500 font-medium">
                      <tr>
                        <th className="px-4 md:px-6 py-4">Pet</th>
                        <th className="px-4 md:px-6 py-4">Raça</th>
                        <th className="px-4 md:px-6 py-4 text-right">Idade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e5e5]">
                      {data.pets.slice(0, 5).map((pet) => (
                        <tr key={pet.id} className="hover:bg-gray-50/50 transition-all duration-500 ease-in-out">
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-2 md:gap-3">
                              <NotionAvatar name={pet.name} breed={pet.breed} type="pet" size="sm" />
                              <p className="font-medium text-primary text-xs md:text-sm">{pet.name}</p>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 text-gray-600 text-xs md:text-sm">{pet.breed}</td>
                          <td className="px-4 md:px-6 py-4 text-right text-gray-600 text-xs md:text-sm">
                            {pet.age} {pet.age === 1 ? "ano" : "anos"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">
                  Nenhum pet cadastrado ainda.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
