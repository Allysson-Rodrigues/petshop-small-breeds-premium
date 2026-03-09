import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { dashboardService } from "../../../services/dashboardService";
import type {
  ApiBookingRequest,
  BookingRequestStatus,
} from "../../../types/api";
import ConfirmationModal from "../components/ConfirmationModal";
import { DashboardActionButton } from "../components/DashboardActionButton";
import {
  DashboardCollectionPanel,
  DashboardFormField,
  DashboardFormGrid,
  DashboardInlineForm,
  dashboardInputClassName,
  dashboardSelectClassName,
} from "../components/DashboardForm";
import { DashboardIdentity } from "../components/DashboardIdentity";
import { ResponsiveCollectionView } from "../components/ResponsiveCollectionView";
import { TabSectionHeader } from "../components/TabSectionHeader";
import { TabLoadingState } from "../components/TabState";
import {
  useAppointmentsData,
  useBookingRequestsData,
} from "../hooks/useDashboardData";

interface AppointmentsTabProps {
  showToast: (message: string) => void;
}

export default function AppointmentsTab({ showToast }: AppointmentsTabProps) {
  const { isAdmin } = useAuth();
  const {
    addAppointment,
    appointments,
    loading,
    pets,
    removeAppointment,
    updateAppointmentInList,
  } = useAppointmentsData(showToast);
  const {
    bookingRequests,
    loading: bookingRequestsLoading,
    updateBookingRequestInList,
  } = useBookingRequestsData(showToast, isAdmin);
  const [isEditing, setIsEditing] = useState(false);
  const [currentApp, setCurrentApp] = useState({ petId: "", type: "", date: "" });
  const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; id?: string; petName?: string }>({ isOpen: false });

  const petName = (petId: string) => pets.find((p) => p.id === petId)?.name ?? "—";
  const petBreed = (petId: string) => pets.find((p) => p.id === petId)?.breed ?? "";
  const ownerGenderGuess = (name: string): "male" | "female" =>
    name.toLowerCase().endsWith("a") ? "female" : "male";

  const handleComplete = async (id: string) => {
    try {
      const updated = await dashboardService.updateAppointmentStatus(id, "COMPLETED");
      updateAppointmentInList(id, () => updated);
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
      removeAppointment(cancelModal.id);
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
      addAppointment(created);
      showToast("Agendamento criado!");
      setIsEditing(false);
    } catch {
      showToast("Falha ao criar agendamento.");
    }
  };

  const handleBookingRequestStatus = async (
    bookingRequest: ApiBookingRequest,
    status: BookingRequestStatus,
    successMessage: string,
  ) => {
    try {
      const updatedBookingRequest = await dashboardService.updateBookingRequestStatus(
        bookingRequest.id,
        status,
      );
      updateBookingRequestInList(bookingRequest.id, () => updatedBookingRequest);
      showToast(successMessage);
    } catch {
      showToast("Falha ao atualizar solicitação pública.");
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

  const formatBookingService = (serviceType: string) =>
    serviceType
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const formatBookingPeriod = (preferredPeriod: "manha" | "tarde") =>
    preferredPeriod === "manha" ? "Manhã" : "Tarde";

  const bookingStatusLabel = (status: BookingRequestStatus) => {
    if (status === "CONTACTED") return "Contatado";
    if (status === "APPROVED") return "Aprovado";
    if (status === "REJECTED") return "Recusado";
    return "Novo";
  };

  const bookingStatusClass = (status: BookingRequestStatus) => {
    if (status === "APPROVED") {
      return "bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold";
    }
    if (status === "REJECTED") {
      return "bg-neutral-900 text-white";
    }
    if (status === "CONTACTED") {
      return "bg-blue-50 border border-blue-200 text-blue-700 font-bold";
    }

    return "bg-white border border-neutral-300 border-dashed text-neutral-600 italic";
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
      <TabSectionHeader
        title="Agendamentos"
        description="Controle a agenda de serviços do petshop."
        action={
          <button onClick={handleNew}
            className="bg-neutral-900 text-white pl-4 pr-6 py-2.5 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2 w-full md:w-auto shadow-lg shadow-black/10 active:scale-95">
            <span className="material-symbols-outlined text-[20px]">calendar_add_on</span>
            Novo Agendamento
          </button>
        }
      />

      <DashboardCollectionPanel isEditing={isEditing}>
        {isEditing && (
          <DashboardInlineForm
            actionsClassName="mt-auto"
            onCancel={() => setIsEditing(false)}
            onClose={() => setIsEditing(false)}
            onSubmit={saveAppointment}
            submitLabel="Salvar Agendamento"
            title="Novo Agendamento"
          >
            <DashboardFormGrid className="grid-cols-1 md:grid-cols-2">
              <DashboardFormField label="Pet">
                <select
                  value={currentApp.petId}
                  onChange={(e) =>
                    setCurrentApp({ ...currentApp, petId: e.target.value })
                  }
                  className={dashboardSelectClassName}
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.breed})
                    </option>
                  ))}
                  {pets.length === 0 ? (
                    <option value="">Cadastre um pet primeiro</option>
                  ) : null}
                </select>
              </DashboardFormField>
              <DashboardFormField label="Serviço">
                <select
                  value={currentApp.type}
                  onChange={(e) =>
                    setCurrentApp({ ...currentApp, type: e.target.value })
                  }
                  className={dashboardSelectClassName}
                >
                  <option value="">Selecione...</option>
                  <option value="BATH">Banho</option>
                  <option value="GROOM">Tosa</option>
                  <option value="BATH_GROOM">Banho & Tosa</option>
                  <option value="CHECKUP">Check-up</option>
                  <option value="VACCINATION">Vacinação</option>
                </select>
              </DashboardFormField>
              <DashboardFormField label="Data e Hora">
                <input
                  type="datetime-local"
                  value={currentApp.date}
                  onChange={(e) =>
                    setCurrentApp({ ...currentApp, date: e.target.value })
                  }
                  className={dashboardInputClassName}
                />
              </DashboardFormField>
            </DashboardFormGrid>
          </DashboardInlineForm>
        )}

        {loading ? (
          <TabLoadingState />
        ) : (
          <ResponsiveCollectionView
            items={appointments}
            emptyLabel="Nenhum agendamento encontrado."
            isEditing={isEditing}
            desktopHeaderRow={(
              <tr>
                <th className="px-6 py-4">Pet</th>
                <th className="px-6 py-4">Serviço</th>
                <th className="px-6 py-4">Data/Hora</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            )}
            renderMobileItem={(app) => (
              <div key={app.id} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <DashboardIdentity
                    avatarType="pet"
                    breed={petBreed(app.petId)}
                    name={petName(app.petId)}
                    size="md"
                    subtitle={app.type}
                  />
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusClass(app.status)}`}>
                    {statusLabel(app.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-600 font-mono">{formatDate(app.date)}</div>
                  <div className="flex gap-2">
                    {app.status === "PENDING" ? (
                      <DashboardActionButton
                        icon="check_circle"
                        onClick={() => handleComplete(app.id)}
                        variant="mobile-muted"
                      />
                    ) : null}
                    <DashboardActionButton
                      icon="cancel"
                      onClick={() => handleCancel(app.id, app.petId)}
                      variant="mobile-strong"
                    />
                  </div>
                </div>
              </div>
            )}
            renderDesktopRow={(app) => (
              <tr key={app.id} className="hover:bg-gray-50/50 transition-all duration-500 ease-in-out">
                <td className="px-6 py-4 font-medium text-primary">
                  <DashboardIdentity
                    avatarType="pet"
                    breed={petBreed(app.petId)}
                    name={petName(app.petId)}
                    size="sm"
                  />
                </td>
                <td className="px-6 py-4 text-gray-600">{app.type}</td>
                <td className="px-6 py-4 text-gray-600 font-mono">{formatDate(app.date)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusClass(app.status)}`}>
                    {statusLabel(app.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {app.status === "PENDING" ? (
                    <DashboardActionButton
                      icon="check_circle"
                      onClick={() => handleComplete(app.id)}
                      title="Concluir"
                      variant="desktop-strong"
                    />
                  ) : null}
                  <DashboardActionButton
                    icon="cancel"
                    onClick={() => handleCancel(app.id, app.petId)}
                    title="Cancelar"
                    variant="desktop-danger"
                  />
                </td>
              </tr>
            )}
          />
        )}
      </DashboardCollectionPanel>

      <ConfirmationModal isOpen={cancelModal.isOpen} onClose={() => setCancelModal({ isOpen: false })}
        onConfirm={confirmCancel} title="Cancelar Agendamento"
        message={`Deseja cancelar o agendamento de ${cancelModal.petName}?`}
        confirmText="Confirmar" cancelText="Manter" variant="warning" />

      {isAdmin ? (
        <DashboardCollectionPanel>
          <div className="flex items-center justify-between gap-4 border-b border-[#e5e5e5] px-5 py-4 md:px-6">
            <div>
              <h2 className="text-base font-bold text-primary md:text-lg">
                Solicitações Públicas
              </h2>
              <p className="text-xs text-gray-500 md:text-sm">
                Fila administrativa de pedidos enviados pelo agendamento público.
              </p>
            </div>
          </div>

          {bookingRequestsLoading ? (
            <TabLoadingState label="Carregando solicitações públicas..." />
          ) : (
            <ResponsiveCollectionView
              items={bookingRequests}
              emptyLabel="Nenhuma solicitação pública encontrada."
              desktopHeaderRow={(
                <tr>
                  <th className="px-6 py-4">Tutor</th>
                  <th className="px-6 py-4">Pet</th>
                  <th className="px-6 py-4">Serviço</th>
                  <th className="px-6 py-4">Preferência</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              )}
              renderMobileItem={(bookingRequest) => (
                <div key={bookingRequest.id} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-3">
                    <DashboardIdentity
                      avatarType="human"
                      gender={ownerGenderGuess(bookingRequest.ownerName)}
                      name={bookingRequest.ownerName}
                      size="md"
                      subtitle={bookingRequest.ownerEmail}
                    />
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${bookingStatusClass(bookingRequest.status)}`}>
                      {bookingStatusLabel(bookingRequest.status)}
                    </span>
                  </div>
                  <div className="rounded-xl border border-[#e5e5e5] bg-gray-50/60 p-3 text-xs text-gray-600">
                    <div className="font-semibold text-primary">
                      {bookingRequest.petName} • {bookingRequest.petBreed}
                    </div>
                    <div>{formatBookingService(bookingRequest.serviceType)}</div>
                    <div>
                      {new Date(bookingRequest.preferredDate).toLocaleDateString("pt-BR")} • {formatBookingPeriod(bookingRequest.preferredPeriod)}
                    </div>
                  </div>
                  <BookingRequestActions
                    bookingRequest={bookingRequest}
                    onUpdateStatus={handleBookingRequestStatus}
                  />
                </div>
              )}
              renderDesktopRow={(bookingRequest) => (
                <tr key={bookingRequest.id} className="hover:bg-gray-50/50 transition-all duration-500 ease-in-out">
                  <td className="px-6 py-4">
                    <DashboardIdentity
                      avatarType="human"
                      gender={ownerGenderGuess(bookingRequest.ownerName)}
                      name={bookingRequest.ownerName}
                      size="sm"
                      subtitle={bookingRequest.ownerEmail}
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="font-medium text-primary">{bookingRequest.petName}</div>
                    <div className="text-xs text-gray-500">{bookingRequest.petBreed}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{formatBookingService(bookingRequest.serviceType)}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(bookingRequest.preferredDate).toLocaleDateString("pt-BR")}
                    <div className="text-xs text-gray-500">{formatBookingPeriod(bookingRequest.preferredPeriod)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bookingStatusClass(bookingRequest.status)}`}>
                      {bookingStatusLabel(bookingRequest.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <BookingRequestActions
                      bookingRequest={bookingRequest}
                      layout="desktop"
                      onUpdateStatus={handleBookingRequestStatus}
                    />
                  </td>
                </tr>
              )}
            />
          )}
        </DashboardCollectionPanel>
      ) : null}
    </div>
  );
}

function BookingRequestActions({
  bookingRequest,
  layout = "mobile",
  onUpdateStatus,
}: {
  bookingRequest: ApiBookingRequest;
  layout?: "desktop" | "mobile";
  onUpdateStatus: (
    bookingRequest: ApiBookingRequest,
    status: BookingRequestStatus,
    successMessage: string,
  ) => Promise<void>;
}) {
  const buttonClassName =
    layout === "desktop"
      ? "rounded-lg border px-3 py-2 text-xs font-semibold transition-colors"
      : "rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors";

  return (
    <div className={`flex flex-wrap gap-2 ${layout === "desktop" ? "justify-end" : ""}`}>
      {bookingRequest.status === "PENDING" ? (
        <button
          type="button"
          className={`${buttonClassName} border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100`}
          onClick={() =>
            onUpdateStatus(
              bookingRequest,
              "CONTACTED",
              `Solicitação de ${bookingRequest.ownerName} marcada como contatada.`,
            )
          }
        >
          Contactar
        </button>
      ) : null}
      {bookingRequest.status !== "APPROVED" ? (
        <button
          type="button"
          className={`${buttonClassName} border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
          onClick={() =>
            onUpdateStatus(
              bookingRequest,
              "APPROVED",
              `Solicitação de ${bookingRequest.ownerName} aprovada.`,
            )
          }
        >
          Aprovar
        </button>
      ) : null}
      {bookingRequest.status !== "REJECTED" ? (
        <button
          type="button"
          className={`${buttonClassName} border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50`}
          onClick={() =>
            onUpdateStatus(
              bookingRequest,
              "REJECTED",
              `Solicitação de ${bookingRequest.ownerName} recusada.`,
            )
          }
        >
          Recusar
        </button>
      ) : null}
    </div>
  );
}
