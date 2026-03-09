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

export interface AdminDashboardData {
	stats: {
		totalPets: number;
		totalAppointments: number;
		totalClients: number;
		totalProducts: number;
		lowStockItems: number;
	};
	recentPets: ApiPet[];
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
