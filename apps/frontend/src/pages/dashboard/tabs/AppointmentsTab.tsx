import { useEffect, useState } from "react";
import { dashboardService, type ApiAppointment, type ApiPet } from "../../../services/dashboardService";
import ConfirmationModal from "../components/ConfirmationModal";
import NotionAvatar from "../components/NotionAvatar";

interface AppointmentsTabProps {
  showToast: (message: string) => void;
}

export default function AppointmentsTab({ showToast }: AppointmentsTabProps) {
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [pets, setPets] = useState<ApiPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentApp, setCurrentApp] = useState({ petId: "", type: "", date: "" });
  const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; id?: string; petName?: string }>({ isOpen: false });

  useEffect(() => {
    Promise.all([dashboardService.getAppointments(), dashboardService.getPets()])
      .then(([apps, p]) => { setAppointments(apps); setPets(p); })
      .catch(() => showToast("Falha ao carregar agendamentos."))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const petName = (petId: string) => pets.find((p) => p.id === petId)?.name ?? "—";
  const petBreed = (petId: string) => pets.find((p) => p.id === petId)?.breed ?? "";

  const handleComplete = async (id: string) => {
    try {
      const updated = await dashboardService.updateAppointmentStatus(id, "COMPLETED");
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast("Agendamento concluído!");
    } catch {
      showToast("Falha ao atualizar status.");
    }
  };

  const handleCancel = (id: string, petId: string) => {
    setCancelModal({ isOpen: true, id, petName: petName(petId) });
  };

  const confirmCancel = async () => {
    if (!cancelModal.id) return;
    try {
      await dashboardService.deleteAppointment(cancelModal.id);
      setAppointments((prev) => prev.filter((a) => a.id !== cancelModal.id));
      showToast(`Agendamento de ${cancelModal.petName} cancelado.`);
    } catch {
      showToast("Falha ao cancelar agendamento.");
    }
    setCancelModal({ isOpen: false });
  };

  const handleNew = () => {
    setCurrentApp({ petId: pets[0]?.id ?? "", type: "", date: "" });
    setIsEditing(true);
  };

  const saveAppointment = async () => {
    if (!currentApp.petId || !currentApp.type || !currentApp.date) {
      showToast("Preencha todos os campos obrigatórios.");
      return;
    }
    try {
      const created = await dashboardService.createAppointment({
        petId: currentApp.petId,
        type: currentApp.type,
        date: new Date(currentApp.date).toISOString(),
      });
      setAppointments((prev) => [...prev, created]);
      showToast("Agendamento criado!");
      setIsEditing(false);
    } catch {
      showToast("Falha ao criar agendamento.");
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) +
      " às " +
      d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const statusLabel = (s: string) => {
    if (s === "COMPLETED") return "Concluído";
    if (s === "CANCELLED") return "Cancelado";
    return "Pendente";
  };

  const statusClass = (s: string) => {
    if (s === "COMPLETED") return "bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold";
    if (s === "CANCELLED") return "bg-neutral-600 text-white";
    return "bg-white border border-neutral-300 border-dashed text-neutral-600 italic";
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">Agendamentos</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Controle a agenda de serviços do petshop.
          </p>
        </div>
        <button onClick={handleNew}
          className="bg-neutral-900 text-white pl-4 pr-6 py-2.5 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2 w-full md:w-auto shadow-lg shadow-black/10 active:scale-95">
          <span className="material-symbols-outlined text-[20px]">calendar_add_on</span>
          Novo Agendamento
        </button>
      </div>

      <div className={`bg-white rounded-2xl border border-[#e5e5e5] shadow-sm relative transition-all duration-300 ${isEditing ? "border-primary/20 shadow-md" : "overflow-hidden"}`}>
        {isEditing && (
          <div className="bg-white/98 z-10 flex flex-col p-6 md:p-8 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300 rounded-2xl min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary">Novo Agendamento</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-primary transition-colors" title="Fechar">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Pet</label>
                <select value={currentApp.petId} onChange={(e) => setCurrentApp({ ...currentApp, petId: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all bg-white">
                  {pets.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.breed})</option>)}
                  {pets.length === 0 && <option value="">Cadastre um pet primeiro</option>}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Serviço</label>
                <select value={currentApp.type} onChange={(e) => setCurrentApp({ ...currentApp, type: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all bg-white">
                  <option value="">Selecione...</option>
                  <option value="BATH">Banho</option>
                  <option value="GROOM">Tosa</option>
                  <option value="BATH_GROOM">Banho & Tosa</option>
                  <option value="CHECKUP">Check-up</option>
                  <option value="VACCINATION">Vacinação</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Data e Hora</label>
                <input type="datetime-local" value={currentApp.date}
                  onChange={(e) => setCurrentApp({ ...currentApp, date: e.target.value })}
                  className="w-full border border-[#e5e5e5] rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/30" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-auto pt-6 border-t border-gray-100">
              <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors order-2 sm:order-1">
                Cancelar
              </button>
              <button onClick={saveAppointment} className="bg-neutral-900 text-white px-10 py-3 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all shadow-lg shadow-black/10 order-1 sm:order-2 active:scale-95">
                Salvar Agendamento
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm animate-pulse">Carregando...</div>
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden divide-y divide-[#e5e5e5]">
              {appointments.map((app) => (
                <div key={app.id} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <NotionAvatar name={petName(app.petId)} breed={petBreed(app.petId)} type="pet" size="md" />
                      <div>
                        <h3 className="font-bold text-primary">{petName(app.petId)}</h3>
                        <p className="text-xs text-gray-500">{app.type}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusClass(app.status)}`}>
                      {statusLabel(app.status)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-600 font-mono">{formatDate(app.date)}</div>
                    <div className="flex gap-2">
                      {app.status === "PENDING" && (
                        <button onClick={() => handleComplete(app.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800">
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                        </button>
                      )}
                      <button onClick={() => handleCancel(app.id, app.petId)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-900 text-white border border-neutral-900">
                        <span className="material-symbols-outlined text-lg">cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop */}
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
                    <tr key={app.id} className="hover:bg-gray-50/50 transition-all duration-500 ease-in-out">
                      <td className="px-6 py-4 font-medium text-primary">
                        <div className="flex items-center gap-3">
                          <NotionAvatar name={petName(app.petId)} breed={petBreed(app.petId)} type="pet" size="sm" />
                          {petName(app.petId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{app.type}</td>
                      <td className="px-6 py-4 text-gray-600 font-mono">{formatDate(app.date)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusClass(app.status)}`}>
                          {statusLabel(app.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {app.status === "PENDING" && (
                          <button onClick={() => handleComplete(app.id)} className="text-neutral-800 hover:text-green-700 transition-all p-1" title="Concluir">
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          </button>
                        )}
                        <button onClick={() => handleCancel(app.id, app.petId)} className="text-gray-400 hover:text-red-500 transition-all p-1 ml-2" title="Cancelar">
                          <span className="material-symbols-outlined text-[18px]">cancel</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {appointments.length === 0 && !isEditing && (
                <div className="p-8 text-center text-gray-500">Nenhum agendamento encontrado.</div>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmationModal isOpen={cancelModal.isOpen} onClose={() => setCancelModal({ isOpen: false })}
        onConfirm={confirmCancel} title="Cancelar Agendamento"
        message={`Deseja cancelar o agendamento de ${cancelModal.petName}?`}
        confirmText="Confirmar" cancelText="Manter" variant="warning" />
    </div>
  );
}
