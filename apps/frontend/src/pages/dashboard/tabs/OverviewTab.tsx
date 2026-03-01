/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { type AdminDashboardData, type DashboardData, dashboardService } from "../../../services/dashboardService";
import NotionAvatar from "../components/NotionAvatar";

interface OverviewTabProps {
  showToast: (message: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function OverviewTab({ showToast, setActiveTab }: OverviewTabProps) {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);

  useEffect(() => {
    if (isAdmin) {
      dashboardService
        .getAdminDashboard()
        .then(setAdminData)
        .catch(() => showToast("Falha ao carregar indicadores de admin."))
        .finally(() => setLoading(false));
    } else {
      dashboardService
        .getDashboard()
        .then(setData)
        .catch(() => showToast("Falha ao carregar dashboard."))
        .finally(() => setLoading(false));
    }
  }, [isAdmin]);

  const stats = isAdmin ? {
    totalPets: adminData?.stats.totalPets ?? 0,
    totalAppointments: adminData?.stats.totalAppointments ?? 0,
    totalClients: adminData?.stats.totalClients ?? 0,
    totalProducts: adminData?.stats.totalProducts ?? 0,
    lowStock: adminData?.stats.lowStockItems ?? 0,
    nextAppointment: null,
  } : {
    totalPets: data?.stats.totalPets ?? 0,
    totalAppointments: data?.stats.totalAppointments ?? 0,
    totalClients: 0,
    totalProducts: 0,
    lowStock: 0,
    nextAppointment: data?.stats.nextAppointment || null,
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
      {/* Page Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">
          {isAdmin ? "Painel Administrativo" : "Visão Geral do Painel"}
        </h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1">
          {isAdmin ? "Gestão global do Petshop e estoque." : "Bem-vindo de volta, veja o que está acontecendo hoje."}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-400 text-sm animate-pulse">
          Carregando indicadores...
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {!isAdmin ? (
               <>
                {/* User View */}
                <Card icon="pets" label="Meus Pets" value={stats.totalPets} />
                <Card icon="event_available" label="Agendamentos" value={stats.totalAppointments} />
                <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e5e5e5] shadow-sm flex flex-col justify-between h-28 md:h-32 relative overflow-hidden group hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-2">
                  <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="material-symbols-outlined text-5xl md:text-6xl text-primary">schedule</span>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm font-medium">Próximo Agendamento</p>
                  <h2 className="text-lg md:text-xl font-bold text-primary tracking-tight">
                    {"nextAppointment" in stats && stats.nextAppointment
                      ? new Date(stats.nextAppointment.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
                      : "Nenhum"}
                  </h2>
                </div>
               </>
            ) : (
              <>
                {/* Admin View */}
                <Card icon="group" label="Total Clientes" value={stats.totalClients} />
                <Card icon="pets" label="Pets Totais" value={stats.totalPets} />
                <Card icon="inventory_2" label="Itens em Estoque" value={stats.totalProducts} />
                <div className={`p-5 md:p-6 rounded-xl border flex flex-col justify-between h-28 md:h-32 relative overflow-hidden group hover:shadow-md transition-all ${stats.lowStock > 0 ? "bg-red-50 border-red-100" : "bg-white border-[#e5e5e5]"}`}>
                   <div className="absolute right-0 top-0 p-4 opacity-10">
                      <span className={`material-symbols-outlined text-5xl md:text-6xl ${stats.lowStock > 0 ? "text-red-500" : "text-primary"}`}>warning</span>
                   </div>
                   <p className={`${stats.lowStock > 0 ? "text-red-600" : "text-gray-500"} text-xs md:text-sm font-medium`}>Alerta de Estoque</p>
                   <h2 className={`text-2xl md:text-3xl font-bold tracking-tight ${stats.lowStock > 0 ? "text-red-700" : "text-primary"}`}>
                      {stats.lowStock} <span className="text-xs font-normal">críticos</span>
                   </h2>
                </div>
              </>
            )}
          </div>

          {/* Quick Actions or Lists */}
          <div className={`${isAdmin ? "grid grid-cols-1 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}`}>
            <div className={isAdmin ? "lg:col-span-2 space-y-4" : ""}>
               <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-primary">Pets Recentes</h2>
                  <button
                    className="text-sm font-medium text-gray-500 hover:text-primary transition-all flex items-center gap-1"
                    onClick={() => setActiveTab("pets")}
                  >
                    Ver todos <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm overflow-hidden">
                  {(isAdmin ? adminData?.recentPets : data?.pets) && (isAdmin ? adminData!.recentPets.length : data!.pets.length) > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-[#e5e5e5] text-xs uppercase text-gray-500 font-medium">
                          <tr>
                            <th className="px-4 md:px-6 py-4">Pet</th>
                            <th className="px-4 md:px-6 py-4">Raça</th>
                            <th className="px-4 md:px-6 py-4 text-right">Idade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e5e5e5]">
                          {(isAdmin ? adminData!.recentPets : data!.pets).slice(0, 5).map((pet) => (
                            <tr key={pet.id} className="hover:bg-gray-50/50 transition-all">
                              <td className="px-4 md:px-6 py-4 flex items-center gap-2">
                                  <NotionAvatar name={pet.name} breed={pet.breed} type="pet" size="sm" />
                                  <span className="font-medium text-primary">{pet.name}</span>
                              </td>
                              <td className="px-4 md:px-6 py-4 text-gray-600">{pet.breed}</td>
                              <td className="px-4 md:px-6 py-4 text-right text-gray-600 font-mono text-[10px] md:text-sm">
                                {pet.age} {pet.age === 1 ? "ano" : "anos"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-400">Nenhum pet encontrado.</div>
                  )}
                </div>
            </div>

            {isAdmin && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">bolt</span>
                        Atalhos
                      </h3>
                      <div className="space-y-3">
                        <button onClick={() => setActiveTab("inventory")} className="w-full text-left p-4 rounded-xl border border-[#e5e5e5] hover:border-primary/30 hover:bg-gray-50 transition-all group">
                            <p className="font-bold text-sm group-hover:text-primary">Inventário</p>
                            <p className="text-xs text-gray-500">Gestão de estoque.</p>
                        </button>
                        <button onClick={() => setActiveTab("clients")} className="w-full text-left p-4 rounded-xl border border-[#e5e5e5] hover:border-primary/30 hover:bg-gray-50 transition-all group">
                            <p className="font-bold text-sm group-hover:text-primary">Clientes</p>
                            <p className="text-xs text-gray-500">Dados cadastrais.</p>
                        </button>
                      </div>
                    </div>

                    <div className="bg-neutral-900 rounded-xl p-4 text-white relative overflow-hidden mt-6">
                      <div className="relative z-10">
                        <h3 className="font-bold text-sm mb-1">Alertas</h3>
                        <p className="text-zinc-400 text-[10px] mb-3">Relatórios em breve.</p>
                      </div>
                      <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-6xl opacity-10">analytics</span>
                    </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Card({ icon, label, value }: { icon: string, label: string, value: string | number }) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e5e5e5] shadow-sm flex flex-col justify-between h-28 md:h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <span className="material-symbols-outlined text-5xl md:text-6xl text-primary">{icon}</span>
      </div>
      <p className="text-gray-500 text-xs md:text-sm font-medium">{label}</p>
      <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">{value}</h2>
    </div>
  );
}
