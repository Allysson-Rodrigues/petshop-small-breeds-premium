import type {
	AdminDashboardData,
	ApiAppointment,
	ApiBookingRequest,
	ApiClient,
	ApiPet,
	ApiProduct,
	AppointmentStatus,
	BookingRequestStatus,
	CreateAppointmentInput,
	CreatePetInput,
	DashboardData,
	UpdatePetInput,
} from "../types/api";
import { isApiError, type ApiError, requestJson } from "./api";
import { authService } from "./authService";

const request = async <T>(
	path: string,
	options: RequestInit = {},
): Promise<T> => {
	try {
		return await requestJson<T>(path, options);
	} catch (error) {
		if (isApiError(error)) {
			if (error.status === 401) {
				authService.handleUnauthorized("Sua sessão expirou. Faça login novamente.");
			}

			throw error;
		}

		throw {
			status: 0,
			message: "Falha de conexão com o servidor.",
		} satisfies ApiError;
	}
};

export type {
	AdminDashboardData,
	ApiAppointment,
	ApiBookingRequest,
	ApiClient,
	ApiPet,
	ApiProduct,
	AppointmentStatus,
	BookingRequestStatus,
	CreateAppointmentInput,
	CreatePetInput,
	DashboardData,
	UpdatePetInput,
} from "../types/api";

export const dashboardService = {
	getDashboard: () => request<DashboardData>("/dashboard/customer"),
	getAdminDashboard: () => request<AdminDashboardData>("/dashboard/admin"),
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
	getAppointments: () => request<ApiAppointment[]>("/dashboard/appointments"),
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
	getBookingRequests: () =>
		request<ApiBookingRequest[]>("/dashboard/booking-requests"),
	updateBookingRequestStatus: (
		id: string,
		status: BookingRequestStatus,
	) =>
		request<ApiBookingRequest>(`/dashboard/booking-requests/${id}`, {
			method: "PUT",
			body: JSON.stringify({ status }),
		}),
	getClients: () => request<ApiClient[]>("/dashboard/clients"),
	updateClient: (id: string, data: Partial<ApiClient>) =>
		request<ApiClient>(`/dashboard/clients/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		}),
	deleteClient: (id: string) =>
		request<void>(`/dashboard/clients/${id}`, { method: "DELETE" }),
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
