import type { Appointment } from "../entities/appointment.entity.js";
import type { Pet } from "../entities/pet.entity.js";
import type { Product } from "../entities/product.entity.js";
import type { User } from "../entities/user.entity.js";
import type { AppointmentRepository } from "../repositories/appointment.repository.js";
import type { PetRepository } from "../repositories/pet.repository.js";
import type { ProductRepository } from "../repositories/product.repository.js";
import type { UserRepository } from "../repositories/user.repository.js";

interface AdminDashboardHistoryPoint {
	appointments: number;
	date: string;
	newClients: number;
}

interface AdminDashboardActivityItem {
	description: string;
	id: string;
	kind: "appointment" | "client";
	occurredAt: string;
	title: string;
	tone: "info" | "success" | "warning";
}

interface AdminDashboardData {
	stats: {
		completedAppointments: number;
		newClientsThisMonth: number;
		todayAppointments: number;
		totalPets: number;
		totalAppointments: number;
		totalClients: number;
		totalProducts: number;
		upcomingAppointments: number;
		lowStockItems: number;
	};
	lowStockProducts: Product[];
	operationalHistory: AdminDashboardHistoryPoint[];
	recentPets: Pet[];
	recentActivity: AdminDashboardActivityItem[];
}

const LOW_STOCK_THRESHOLD = 5;
const RECENT_PETS_LIMIT = 5;
const LOW_STOCK_PRODUCTS_LIMIT = 4;
const HISTORY_WINDOW_DAYS = 7;
const RECENT_ACTIVITY_LIMIT = 6;

const appointmentLabels: Record<string, string> = {
	BATH: "Banho",
	BATH_GROOM: "Banho e tosa",
	CHECKUP: "Check-up",
	GROOM: "Tosa",
	VACCINATION: "Vacinação",
};

function startOfDay(date: Date) {
	const nextDate = new Date(date);
	nextDate.setHours(0, 0, 0, 0);
	return nextDate;
}

function endOfDay(date: Date) {
	const nextDate = startOfDay(date);
	nextDate.setDate(nextDate.getDate() + 1);
	return nextDate;
}

function startOfMonth(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isWithinRange(date: Date, rangeStart: Date, rangeEnd: Date) {
	const time = date.getTime();
	return time >= rangeStart.getTime() && time < rangeEnd.getTime();
}

function formatDayKey(date: Date) {
	return startOfDay(date).toISOString().slice(0, 10);
}

function getAppointmentLabel(type: string) {
	return appointmentLabels[type] ?? type.toLowerCase().replaceAll("_", " ");
}

function getAppointmentActivityTitle(appointment: {
	status: string;
	type: string;
}) {
	const label = getAppointmentLabel(appointment.type);

	switch (appointment.status) {
		case "COMPLETED":
			return `${label} concluído`;
		case "CANCELLED":
			return `${label} cancelado`;
		case "CONFIRMED":
			return `${label} confirmado`;
		default:
			return `${label} agendado`;
	}
}

function getAppointmentActivityDescription(appointment: Appointment) {
	const scheduledDate = new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		month: "short",
	}).format(new Date(appointment.date));

	return `Compromisso previsto para ${scheduledDate}.`;
}

function getAppointmentActivityTone(
	status: string,
): "info" | "success" | "warning" {
	switch (status) {
		case "COMPLETED":
			return "success";
		case "CANCELLED":
			return "warning";
		default:
			return "info";
	}
}

function buildOperationalHistory(
	appointments: Appointment[],
	clients: User[],
	currentDate: Date,
): AdminDashboardHistoryPoint[] {
	const historyStart = startOfDay(currentDate);
	historyStart.setDate(historyStart.getDate() - (HISTORY_WINDOW_DAYS - 1));

	return Array.from({ length: HISTORY_WINDOW_DAYS }, (_, index) => {
		const dayStart = new Date(historyStart);
		dayStart.setDate(historyStart.getDate() + index);
		const dayEnd = endOfDay(dayStart);

		return {
			appointments: appointments.filter((appointment) =>
				isWithinRange(new Date(appointment.date), dayStart, dayEnd),
			).length,
			date: formatDayKey(dayStart),
			newClients: clients.filter((client) =>
				isWithinRange(new Date(client.createdAt), dayStart, dayEnd),
			).length,
		};
	});
}

function buildRecentActivity(
	appointments: Appointment[],
	clients: User[],
): AdminDashboardActivityItem[] {
	const appointmentActivity = appointments.map((appointment) => ({
		description: getAppointmentActivityDescription(appointment),
		id: `appointment-${appointment.id}`,
		kind: "appointment" as const,
		occurredAt: new Date(appointment.date).toISOString(),
		title: getAppointmentActivityTitle(appointment),
		tone: getAppointmentActivityTone(appointment.status),
	}));

	const clientActivity = clients.map((client) => ({
		description: `${client.name} entrou na base de clientes do painel.`,
		id: `client-${client.id}`,
		kind: "client" as const,
		occurredAt: new Date(client.createdAt).toISOString(),
		title: "Novo cliente cadastrado",
		tone: "success" as const,
	}));

	return [...appointmentActivity, ...clientActivity]
		.sort(
			(leftItem, rightItem) =>
				new Date(rightItem.occurredAt).getTime() -
				new Date(leftItem.occurredAt).getTime(),
		)
		.slice(0, RECENT_ACTIVITY_LIMIT);
}

export class GetAdminDashboardUseCase {
	constructor(
		private readonly petRepository: PetRepository,
		private readonly appointmentRepository: AppointmentRepository,
		private readonly userRepository: UserRepository,
		private readonly productRepository: ProductRepository,
	) {}

	async execute(): Promise<AdminDashboardData> {
		const currentDate = new Date();
		const todayStart = startOfDay(currentDate);
		const todayEnd = endOfDay(currentDate);
		const monthStart = startOfMonth(currentDate);
		const [
			totalPets,
			totalAppointments,
			totalClients,
			totalProducts,
			lowStockItems,
			recentPets,
			appointments,
			clients,
			products,
		] = await Promise.all([
			this.petRepository.countAll(),
			this.appointmentRepository.countAll(),
			this.userRepository.countClients(),
			this.productRepository.countAll(),
			this.productRepository.countLowStock(LOW_STOCK_THRESHOLD),
			this.petRepository.findRecent(RECENT_PETS_LIMIT),
			this.appointmentRepository.findAll(),
			this.userRepository.findClients(),
			this.productRepository.findAll(),
		]);

		const todayAppointments = appointments.filter((appointment) =>
			isWithinRange(new Date(appointment.date), todayStart, todayEnd),
		).length;
		const upcomingAppointments = appointments.filter((appointment) => {
			const appointmentDate = new Date(appointment.date);
			return (
				appointmentDate.getTime() >= currentDate.getTime() &&
				(appointment.status === "PENDING" || appointment.status === "CONFIRMED")
			);
		}).length;
		const completedAppointments = appointments.filter(
			(appointment) => appointment.status === "COMPLETED",
		).length;
		const newClientsThisMonth = clients.filter(
			(client) => new Date(client.createdAt).getTime() >= monthStart.getTime(),
		).length;
		const lowStockProducts = products
			.filter((product) => product.stock <= LOW_STOCK_THRESHOLD)
			.sort(
				(leftProduct, rightProduct) =>
					leftProduct.stock - rightProduct.stock ||
					leftProduct.name.localeCompare(rightProduct.name),
			)
			.slice(0, LOW_STOCK_PRODUCTS_LIMIT);

		return {
			stats: {
				completedAppointments,
				newClientsThisMonth,
				todayAppointments,
				totalPets,
				totalAppointments,
				totalClients,
				totalProducts,
				upcomingAppointments,
				lowStockItems,
			},
			lowStockProducts,
			operationalHistory: buildOperationalHistory(
				appointments,
				clients,
				currentDate,
			),
			recentPets,
			recentActivity: buildRecentActivity(appointments, clients),
		};
	}
}
