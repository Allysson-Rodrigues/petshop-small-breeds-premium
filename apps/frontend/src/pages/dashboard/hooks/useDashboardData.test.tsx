import {
	appendDashboardItem,
	createAppointmentsResource,
	removeDashboardItem,
	updateDashboardItem,
} from "./dashboardDataState";

describe("useDashboardData hooks", () => {
	it("mantem add, update e remove previsiveis para colecoes do dashboard", () => {
		const initialPets = [
			{
				age: 3,
				breed: "Maltês",
				id: "pet-1",
				name: "Nina",
				userId: "user-1",
			},
		];

		const petsWithNewItem = appendDashboardItem(initialPets, {
			age: 2,
			breed: "Pug",
			id: "pet-2",
			name: "Theo",
			userId: "user-1",
		});
		const updatedPets = updateDashboardItem(petsWithNewItem, "pet-1", (pet) => ({
			...pet,
			name: "Nina Atualizada",
		}));
		const finalPets = removeDashboardItem(updatedPets, "pet-2");

		expect(finalPets).toEqual([
			{
				age: 3,
				breed: "Maltês",
				id: "pet-1",
				name: "Nina Atualizada",
				userId: "user-1",
			},
		]);
	});

	it("preserva pets ao montar o recurso de agendamentos e atualizar um item", () => {
		const appointmentsResource = createAppointmentsResource(
			[
				{
					date: "2026-03-09T14:00:00.000Z",
					id: "appt-1",
					petId: "pet-1",
					status: "PENDING",
					type: "BATH",
				},
			],
			[
				{
					age: 4,
					breed: "Shih-tzu",
					id: "pet-1",
					name: "Luna",
					userId: "user-1",
				},
			],
		);
		const nextAppointments = updateDashboardItem(
			appointmentsResource.appointments,
			"appt-1",
			(appointment) => ({
				...appointment,
				status: "COMPLETED",
			}),
		);

		expect({
			...appointmentsResource,
			appointments: nextAppointments,
		}).toEqual({
			appointments: [
				{
					date: "2026-03-09T14:00:00.000Z",
					id: "appt-1",
					petId: "pet-1",
					status: "COMPLETED",
					type: "BATH",
				},
			],
			pets: [
				{
					age: 4,
					breed: "Shih-tzu",
					id: "pet-1",
					name: "Luna",
					userId: "user-1",
				},
			],
		});
	});
});
