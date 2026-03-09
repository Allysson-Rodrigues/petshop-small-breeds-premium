export interface ApiPet {
	id: string;
	name: string;
	breed: string;
	age: number;
	userId: string;
}

export type AppointmentStatus =
	| "PENDING"
	| "CONFIRMED"
	| "CANCELLED"
	| "COMPLETED";

export interface ApiAppointment {
	id: string;
	date: string;
	type: string;
	status: AppointmentStatus;
	userId: string;
	petId: string;
}

export interface ApiClient {
	id: string;
	name: string;
	email: string;
	createdAt: string;
	petsCount: number;
}

export interface ApiProduct {
	id: string;
	name: string;
	description: string;
	price: number;
	category: string;
	stock: number;
}

export interface AdminDashboardHistoryPoint {
	appointments: number;
	date: string;
	newClients: number;
}

export interface AdminDashboardActivityItem {
	description: string;
	id: string;
	kind: "appointment" | "client";
	occurredAt: string;
	title: string;
	tone: "info" | "success" | "warning";
}

export interface AdminDashboardData {
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
	lowStockProducts: ApiProduct[];
	operationalHistory: AdminDashboardHistoryPoint[];
	recentPets: ApiPet[];
	recentActivity: AdminDashboardActivityItem[];
}

export interface DashboardData {
	pets: ApiPet[];
	appointments: ApiAppointment[];
	stats: {
		totalPets: number;
		totalAppointments: number;
		nextAppointment: ApiAppointment | null;
	};
}

export interface CreatePetInput {
	name: string;
	breed: string;
	age: number;
}

export interface UpdatePetInput {
	name?: string;
	breed?: string;
	age?: number;
}

export interface CreateAppointmentInput {
	date: string;
	type: string;
	petId: string;
}

export interface BookingRequestInput {
	petName: string;
	petBreed: string;
	serviceType: string;
	preferredDate: string;
	preferredPeriod: "manha" | "tarde";
	ownerName: string;
	ownerEmail: string;
	ownerPhone?: string;
	notes?: string;
}

export interface BookingRequestResponse {
	id: string;
	status: string;
	protocol: string;
	message: string;
}

export type BookingRequestStatus =
	| "PENDING"
	| "CONTACTED"
	| "APPROVED"
	| "REJECTED";

export interface ApiBookingRequest {
	id: string;
	petName: string;
	petBreed: string;
	serviceType: string;
	preferredDate: string;
	preferredPeriod: "manha" | "tarde";
	ownerName: string;
	ownerEmail: string;
	ownerPhone?: string | null;
	notes?: string | null;
	status: BookingRequestStatus;
	createdAt: string;
}
