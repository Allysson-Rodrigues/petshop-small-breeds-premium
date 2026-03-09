import type { ApiAppointment, ApiPet } from "../../../types/api";

export type DashboardEntity = {
	id: string;
};

export type AppointmentsResourceData = {
	appointments: ApiAppointment[];
	pets: ApiPet[];
};

export function appendDashboardItem<T>(items: T[], item: T): T[] {
	return [...items, item];
}

export function removeDashboardItem<T extends DashboardEntity>(
	items: T[],
	id: string,
): T[] {
	return items.filter((item) => item.id !== id);
}

export function updateDashboardItem<T extends DashboardEntity>(
	items: T[],
	id: string,
	updater: (item: T) => T,
): T[] {
	return items.map((item) => (item.id === id ? updater(item) : item));
}

export function createAppointmentsResource(
	appointments: ApiAppointment[],
	pets: ApiPet[],
): AppointmentsResourceData {
	return {
		appointments,
		pets,
	};
}
