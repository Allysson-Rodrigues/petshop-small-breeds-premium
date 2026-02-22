import { useState } from "react";

interface OverviewTabProps {
  showToast: (message: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function OverviewTab({ showToast, setActiveTab }: OverviewTabProps) {
  const [alerts, setAlerts] = useState([
    {
      id: "premium",
      name: "Ração Premium",
      count: 4,
      status: "BAIXO",
      icon: "nutrition",
      color: "red",
    },
    {
      id: "shampoo",
      name: "Shampoo Orgânico",
      count: 3,
      status: "RESTAM 3",
      icon: "soap",
      color: "orange",
    },
    {
      id: "toy",
      name: "Brinquedo de Borracha",
      count: 5,
      status: "RESTAM 5",
      icon: "toys",
      color: "yellow",
    },
  ]);

  const handleReposter = (id: string, name: string) => {
    setAlerts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, count: item.count + 10, status: "OK" } : item
      )
    );
    showToast(`Pedido de reposição (${name}) enviado! Estoque atualizado.`);
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
      {/* SEO optimization */}
      <head>
        <title>Dashboard Admin | Small Breeds</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      {/* Page Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">
          Visão Geral do Painel
        </h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1">
          Bem-vindo de volta, veja o que está acontecendo hoje.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e5e5e5] shadow-sm flex flex-col justify-between h-28 md:h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-5xl md:text-6xl text-primary">
              pets
            </span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm font-medium">Total de Pets</p>
          <div className="flex items-end gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">524</h2>
            <span className="text-[10px] md:text-xs text-neutral-800 font-bold font-medium mb-1 md:mb-1.5 flex items-center bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded">
              <span className="material-symbols-outlined text-[12px] md:text-[14px] mr-0.5">
                trending_up
              </span>
              +12%
            </span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e5e5e5] shadow-sm flex flex-col justify-between h-28 md:h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-5xl md:text-6xl text-primary">
              payments
            </span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm font-medium">Receita Diária</p>
          <div className="flex items-end gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">$1,240</h2>
            <span className="text-[10px] md:text-xs text-neutral-800 font-bold font-medium mb-1 md:mb-1.5 flex items-center bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded">
              <span className="material-symbols-outlined text-[12px] md:text-[14px] mr-0.5">
                trending_up
              </span>
              +5.2%
            </span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-5 md:p-6 rounded-xl border border-[#e5e5e5] shadow-sm flex flex-col justify-between h-28 md:h-32 relative overflow-hidden group hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-5xl md:text-6xl text-primary">
              event_available
            </span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm font-medium">Agendamentos Ativos</p>
          <div className="flex items-end gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">18</h2>
            <span className="text-xs text-gray-400 font-medium mb-1.5">Hoje</span>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Agendamentos de Hoje</h2>
            <button
              className="text-sm font-medium text-gray-500 hover:text-primary transition-all duration-500 ease-in-out flex items-center gap-1"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("appointments");
              }}
            >
              Ver todos{" "}
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </button>
          </div>
          <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[500px] md:min-w-0">
                <thead className="bg-gray-50 border-b border-[#e5e5e5] text-xs uppercase text-gray-500 font-medium">
                  <tr>
                    <th className="px-4 md:px-6 py-4">Pet</th>
                    <th className="px-4 md:px-6 py-4">Serviço</th>
                    <th className="px-4 md:px-6 py-4">Horário</th>
                    <th className="px-4 md:px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5]">
                  <tr className="hover:bg-gray-50/50 transition-all duration-500 ease-in-out">
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            alt="Golden Retriever puppy portrait"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxyWuZta1BOyZ33xhCu-wwERl5dBf9gBjR8JxRkRrnVsk3CctwHNmiIUdm-kt0vr3d5d_5hHlqmw8e_YD3tIes2nhk5f-It088QTjRkbu8nnpJfpV4mirmp_DC70ZkG5_BwjB6dvToRYshRczmb46aldDUhlCIj3CvNtuD3jvjVzipczM8QIP_Vz7oXosyJCq66lo7ALVKAcuB0sZUpTYIQnX7L4NICnd1NpFYAJEhsJ1I8F7nyufCPXgxwDUtmGvegWoNV29TUqc"
                          />
                        </div>
                        <div className="truncate">
                          <p className="font-medium text-primary text-xs md:text-sm truncate">Bella</p>
                          <p className="text-[10px] md:text-xs text-gray-400 truncate">Golden Retriever</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-600 text-xs md:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                        <span className="truncate">Tosa</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 font-mono text-gray-600 text-[10px] md:text-sm whitespace-nowrap">10:00 AM</td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <span className="inline-flex items-center px-1.5 md:px-2.5 py-0.5 rounded-full text-[9px] md:text-xs font-medium bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold">
                        Confirmado
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-all duration-500 ease-in-out">
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            alt="French bulldog looking curious"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK_Gchu2mVI8m1UUlFcukeV40uiko9l__41-7EO_qvTsGcCcbHy71MFTf2lXav-z9cV_MTjkK_2NdrQYtc2DMmNRFUsA3HO8XFfOiUwBqXtLxLxpeMygS3Axdq11bCaOusmc7JjLhgrZoKTt4U6VqwHsvTln-Uq8Uxnox1OxF-8LOf5HfmpascJuEfZZ-jEkFg1ImDH_tIpZpjeTLeGekTyRI7JsCzOf0ZJXVxUgR9oNxEXZg8zfLvYIhjIIS09DIiB40DHAnwQSk"
                          />
                        </div>
                        <div className="truncate">
                          <p className="font-medium text-primary text-xs md:text-sm truncate">Max</p>
                          <p className="text-[10px] md:text-xs text-gray-400 truncate">French Bulldog</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-600 text-xs md:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 shrink-0"></span>
                        <span className="truncate">Check-up</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 font-mono text-gray-600 text-[10px] md:text-sm whitespace-nowrap">11:30 AM</td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <span className="inline-flex items-center px-1.5 md:px-2.5 py-0.5 rounded-full text-[9px] md:text-xs font-medium bg-white border border-neutral-300 border-dashed text-neutral-600 italic">
                        Pendente
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Alertas de Estoque</h2>
            <button
              className="text-sm font-medium text-gray-500 hover:text-primary transition-all duration-500 ease-in-out"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("inventory");
              }}
            >
              Gerenciar
            </button>
          </div>
          <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm p-5 h-full flex flex-col gap-5">
            {alerts.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-start pb-4 border-b border-[#e5e5e5] last:border-0 last:pb-0"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-gray-400">
                    {item.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-primary text-sm truncate pr-2">
                      {item.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.color === "red"
                        ? "text-white bg-neutral-900 text-white"
                        : item.color === "orange"
                          ? "text-white bg-neutral-600 text-white"
                          : "text-neutral-600 italic bg-white border border-neutral-300 border-dashed"
                        }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    Apenas {item.count} unidades restantes no estoque.
                  </p>
                  <button
                    className="w-full py-1.5 px-3 bg-primary text-white text-xs font-medium rounded hover:bg-[#4d4d4d] transition-all duration-500 ease-in-out flex items-center justify-center gap-1.5"
                    onClick={(e) => {
                      e.preventDefault();
                      handleReposter(item.id, item.name);
                    }}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      add_shopping_cart
                    </span>
                    Repor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
