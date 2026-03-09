import {
	buildAdminNotifications,
	buildCustomerNotifications,
} from "./dashboardNotifications";

describe("dashboardNotifications", () => {
	it("gera notificacoes administrativas a partir do dashboard real", () => {
		const notifications = buildAdminNotifications({
			lowStockProducts: [],
			operationalHistory: [],
			recentPets: [
				{
					age: 2,
					breed: "Maltês",
					id: "pet-1",
					name: "Nina",
					userId: "user-1",
				},
			],
			recentActivity: [],
			stats: {
				completedAppointments: 4,
				lowStockItems: 3,
				newClientsThisMonth: 2,
				todayAppointments: 5,
				totalAppointments: 12,
				totalClients: 8,
				totalPets: 20,
				totalProducts: 18,
				upcomingAppointments: 6,
			},
		});

		expect(notifications).toEqual([
			expect.objectContaining({
				id: "admin-low-stock",
				title: "Estoque crítico no painel",
				unread: true,
			}),
			expect.objectContaining({
				id: "admin-appointments-summary",
				title: "Agenda operacional atualizada",
			}),
			expect.objectContaining({
				id: "admin-recent-pet-pet-1",
				title: "Nina entrou no painel",
			}),
		]);
	});

	it("gera notificacoes do cliente com base no proximo agendamento e pets", () => {
		const notifications = buildCustomerNotifications({
			appointments: [
				{
					date: "2026-03-12T14:30:00.000Z",
					id: "appt-1",
					petId: "pet-1",
					status: "PENDING",
					type: "BATH",
					userId: "user-1",
				},
				{
					date: "2026-03-13T10:00:00.000Z",
					id: "appt-2",
					petId: "pet-1",
					status: "CONFIRMED",
					type: "CHECKUP",
					userId: "user-1",
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
			stats: {
				nextAppointment: {
					date: "2026-03-12T14:30:00.000Z",
					id: "appt-1",
					petId: "pet-1",
					status: "PENDING",
					type: "BATH",
					userId: "user-1",
				},
				totalAppointments: 2,
				totalPets: 1,
			},
		});

		expect(notifications).toEqual([
			expect.objectContaining({
				id: "customer-next-appointment-appt-1",
				title: "Próximo cuidado de Luna",
				unread: true,
			}),
			expect.objectContaining({
				id: "customer-pending-appointments",
				title: "Você tem compromissos em aberto",
			}),
			expect.objectContaining({
				id: "customer-pets-summary",
				title: "Cadastro dos pets sincronizado",
			}),
		]);
	});

	it("gera onboarding real quando o cliente ainda nao cadastrou pets", () => {
		const notifications = buildCustomerNotifications({
			appointments: [],
			pets: [],
			stats: {
				nextAppointment: null,
				totalAppointments: 0,
				totalPets: 0,
			},
		});

		expect(notifications).toEqual([
			expect.objectContaining({
				id: "customer-empty-pets",
				title: "Seu painel ainda está vazio",
				unread: true,
			}),
		]);
	});
});
