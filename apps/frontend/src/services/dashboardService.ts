import { authService } from "./authService";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(
	/\/$/,
	"",
);

const authHeaders = (): HeadersInit => {
	const token = authService.getToken();
	return {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};
};

const request = async <T>(
	path: string,
	options: RequestInit = {},
): Promise<T> => {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers: {
			...authHeaders(),
			...(options.headers ?? {}),
		},
	});

	if (!response.ok) {
		const body = await response.json().catch(() => ({}));
		throw new Error(
			(body as { message?: string }).message ?? `Request failed: ${response.status}`,
		);
	}

	return response.json() as Promise<T>;
};

// ── Types ─────────────────────────────────────────────────────
export interface ApiPet {
	id: string;
	name: string;
	breed: string;
	age: number;
	userId: string;
}

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

export type AppointmentStatus =
	| "PENDING"
	| "CONFIRMED"
	| "CANCELLED"
	| "COMPLETED";

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

// ── API Methods ───────────────────────────────────────────────
export const dashboardService = {
	// Dashboard overview
	getDashboard: () => request<DashboardData>("/dashboard/customer"),
	getAdminDashboard: () => request<AdminDashboardData>("/dashboard/admin"),

	// Pets
	getPets: () => request<ApiPet[]>("/dashboard/pets"),
	createPet: (data: CreatePetInput) =>
		request<ApiPet>("/dashboard/pets", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	updatePet: (id: string, data: UpdatePetInput) =>
		request<ApiPet>(`/dashboard/pets/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		}),
	deletePet: (id: string) =>
		request<void>(`/dashboard/pets/${id}`, { method: "DELETE" }),

	// Appointments
	getAppointments: () =>
		request<ApiAppointment[]>("/dashboard/appointments"),
	createAppointment: (data: CreateAppointmentInput) =>
		request<ApiAppointment>("/dashboard/appointments", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	updateAppointmentStatus: (id: string, status: AppointmentStatus) =>
		request<ApiAppointment>(`/dashboard/appointments/${id}`, {
			method: "PUT",
			body: JSON.stringify({ status }),
		}),
	deleteAppointment: (id: string) =>
		request<void>(`/dashboard/appointments/${id}`, { method: "DELETE" }),

	// Clients
	getClients: () => request<ApiClient[]>("/dashboard/clients"),
	updateClient: (id: string, data: Partial<ApiClient>) =>
		request<ApiClient>(`/dashboard/clients/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		}),
	deleteClient: (id: string) =>
		request<void>(`/dashboard/clients/${id}`, { method: "DELETE" }),

	// Products (Inventory)
	getProducts: () => request<ApiProduct[]>("/dashboard/products"),
	createProduct: (data: Omit<ApiProduct, "id">) =>
		request<ApiProduct>("/dashboard/products", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	updateProduct: (id: string, data: Partial<ApiProduct>) =>
		request<ApiProduct>(`/dashboard/products/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		}),
	deleteProduct: (id: string) =>
		request<void>(`/dashboard/products/${id}`, { method: "DELETE" }),
};
