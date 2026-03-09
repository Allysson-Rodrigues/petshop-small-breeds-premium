import type {
	AdminDashboardData,
	ApiAppointment,
	DashboardData,
} from "../../../types/api";

export interface DashboardNotification {
	description: string;
	icon: string;
	iconColor: string;
	id: string;
	time: string;
	title: string;
	unread: boolean;
}

const serviceLabels: Record<string, string> = {
	BATH: "Banho",
	BATH_GROOM: "Banho e tosa",
	CHECKUP: "Check-up",
	GROOM: "Tosa",
	VACCINATION: "Vacinação",
};

function formatAppointmentLabel(appointment: ApiAppointment) {
	return (
		serviceLabels[appointment.type] ??
		appointment.type.toLowerCase().replaceAll("_", " ")
	);
}

function formatAppointmentDate(date: string) {
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		month: "short",
	}).format(new Date(date));
}

export function buildAdminNotifications(
	data: AdminDashboardData,
): DashboardNotification[] {
	const notifications: DashboardNotification[] = [];

	if (data.stats.lowStockItems > 0) {
		notifications.push({
			description: `${data.stats.lowStockItems} item(ns) abaixo do limite de estoque seguro.`,
			icon: "warning",
			iconColor: "text-amber-500",
			id: "admin-low-stock",
			time: "agora",
			title: "Estoque crítico no painel",
			unread: true,
		});
	}

	if (data.stats.totalAppointments > 0) {
		notifications.push({
			description: `${data.stats.totalAppointments} agendamento(s) registrados no sistema.`,
			icon: "calendar_month",
			iconColor: "text-blue-500",
			id: "admin-appointments-summary",
			time: "painel",
			title: "Agenda operacional atualizada",
			unread: false,
		});
	}

	for (const pet of data.recentPets.slice(0, 2)) {
		notifications.push({
			description: `${pet.breed} apareceu entre os pets recentes do cadastro.`,
			icon: "pets",
			iconColor: "text-emerald-500",
			id: `admin-recent-pet-${pet.id}`,
			time: "recente",
			title: `${pet.name} entrou no painel`,
			unread: false,
		});
	}

	return notifications;
}

export function buildCustomerNotifications(
	data: DashboardData,
): DashboardNotification[] {
	const notifications: DashboardNotification[] = [];
	const pendingAppointments = data.appointments.filter(
		(appointment) =>
			appointment.status === "PENDING" || appointment.status === "CONFIRMED",
	);
	const petsById = new Map(data.pets.map((pet) => [pet.id, pet]));
	const nextAppointment = data.stats.nextAppointment;

	if (nextAppointment) {
		const petName = petsById.get(nextAppointment.petId)?.name ?? "seu pet";

		notifications.push({
			description: `${formatAppointmentLabel(nextAppointment)} em ${formatAppointmentDate(nextAppointment.date)}.`,
			icon: "calendar_month",
			iconColor: "text-blue-500",
			id: `customer-next-appointment-${nextAppointment.id}`,
			time: "agenda",
			title: `Próximo cuidado de ${petName}`,
			unread: true,
		});
	}

	if (pendingAppointments.length > 1) {
		notifications.push({
			description: `${pendingAppointments.length} agendamento(s) aguardando acompanhamento no painel.`,
			icon: "event_available",
			iconColor: "text-violet-500",
			id: "customer-pending-appointments",
			time: "painel",
			title: "Você tem compromissos em aberto",
			unread: false,
		});
	}

	if (data.pets.length === 0) {
		notifications.push({
			description: "Cadastre seu primeiro pet para liberar novos agendamentos.",
			icon: "pets",
			iconColor: "text-neutral-500",
			id: "customer-empty-pets",
			time: "agora",
			title: "Seu painel ainda está vazio",
			unread: true,
		});

		return notifications;
	}

	notifications.push({
		description: `${data.pets.length} pet(s) disponível(is) para acompanhamento e agendamento.`,
		icon: "favorite",
		iconColor: "text-rose-500",
		id: "customer-pets-summary",
		time: "painel",
		title: "Cadastro dos pets sincronizado",
		unread: false,
	});

	return notifications;
}
