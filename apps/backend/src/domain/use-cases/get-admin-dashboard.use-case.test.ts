import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Appointment } from "../entities/appointment.entity.js";
import type { Pet } from "../entities/pet.entity.js";
import { type Product, ProductCategory } from "../entities/product.entity.js";
import type { User } from "../entities/user.entity.js";
import type { AppointmentRepository } from "../repositories/appointment.repository.js";
import type { PetRepository } from "../repositories/pet.repository.js";
import type { ProductRepository } from "../repositories/product.repository.js";
import type { UserRepository } from "../repositories/user.repository.js";
import { GetAdminDashboardUseCase } from "./get-admin-dashboard.use-case.js";

const mockPets: Pet[] = [
	{ id: "p1", name: "Rex", breed: "Poodle", age: 3, userId: "u1" },
	{ id: "p2", name: "Luna", breed: "Shih Tzu", age: 2, userId: "u1" },
	{ id: "p3", name: "Max", breed: "Yorkshire", age: 4, userId: "u2" },
];

const mockAppointments: Appointment[] = [
	{
		date: new Date("2026-03-09T09:00:00"),
		id: "appt-1",
		petId: "p1",
		status: "PENDING",
		type: "BATH",
		userId: "u1",
	},
	{
		date: new Date("2026-03-09T14:30:00"),
		id: "appt-2",
		petId: "p2",
		status: "COMPLETED",
		type: "GROOM",
		userId: "u1",
	},
	{
		date: new Date("2026-03-11T10:15:00"),
		id: "appt-3",
		petId: "p3",
		status: "CONFIRMED",
		type: "CHECKUP",
		userId: "u2",
	},
	{
		date: new Date("2026-03-05T08:00:00"),
		id: "appt-4",
		petId: "p3",
		status: "CANCELLED",
		type: "VACCINATION",
		userId: "u2",
	},
];

const mockClients: User[] = [
	{
		createdAt: new Date("2026-03-09T08:45:00"),
		email: "cliente-1@petshop.com",
		id: "u1",
		name: "Ana",
		password: "hash",
		role: "client",
	},
	{
		createdAt: new Date("2026-03-07T10:10:00"),
		email: "cliente-2@petshop.com",
		id: "u2",
		name: "Bruno",
		password: "hash",
		role: "client",
	},
];

const mockProducts: Product[] = [
	{
		category: ProductCategory.ACCESSORY,
		description: "Item baixo",
		id: "prod-1",
		name: "Brinquedo",
		price: 19.9,
		stock: 2,
	},
	{
		category: ProductCategory.ACCESSORY,
		description: "Item critico",
		id: "prod-2",
		name: "Coleira",
		price: 39.9,
		stock: 1,
	},
	{
		category: ProductCategory.FOOD,
		description: "Item ok",
		id: "prod-3",
		name: "Racao",
		price: 99.9,
		stock: 12,
	},
];

function makeStubs() {
	const petRepository: PetRepository = {
		findAll: vi.fn(),
		findRecent: vi.fn().mockResolvedValue(mockPets.slice(0, 2)),
		countAll: vi.fn().mockResolvedValue(3),
		countByOwnerIds: vi.fn(),
		findById: vi.fn(),
		findByUserId: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	};
	const appointmentRepository: AppointmentRepository = {
		findAll: vi.fn().mockResolvedValue(mockAppointments),
		countAll: vi.fn().mockResolvedValue(mockAppointments.length),
		findById: vi.fn(),
		findByUserId: vi.fn(),
		create: vi.fn(),
		updateStatus: vi.fn(),
		delete: vi.fn(),
	};
	const userRepository: UserRepository = {
		findAll: vi.fn(),
		findClients: vi.fn().mockResolvedValue(mockClients),
		countClients: vi.fn().mockResolvedValue(mockClients.length),
		create: vi.fn(),
		findByEmail: vi.fn(),
		findById: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	};
	const productRepository: ProductRepository = {
		findAll: vi.fn().mockResolvedValue(mockProducts),
		countAll: vi.fn().mockResolvedValue(mockProducts.length),
		countLowStock: vi.fn().mockResolvedValue(2),
		findById: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	};
	return {
		petRepository,
		appointmentRepository,
		userRepository,
		productRepository,
	};
}

describe("GetAdminDashboardUseCase", () => {
	let sut: GetAdminDashboardUseCase;
	let stubs: ReturnType<typeof makeStubs>;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-03-09T12:00:00"));
		stubs = makeStubs();
		sut = new GetAdminDashboardUseCase(
			stubs.petRepository,
			stubs.appointmentRepository,
			stubs.userRepository,
			stubs.productRepository,
		);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should return aggregated stats", async () => {
		const result = await sut.execute();

		expect(result.stats.totalPets).toBe(3);
		expect(result.stats.totalAppointments).toBe(4);
		expect(result.stats.totalClients).toBe(2);
		expect(result.stats.totalProducts).toBe(3);
	});

	it("should calculate low stock items (stock <= 5)", async () => {
		const result = await sut.execute();

		expect(result.stats.lowStockItems).toBe(2);
		expect(result.lowStockProducts).toEqual([
			expect.objectContaining({ id: "prod-2", stock: 1 }),
			expect.objectContaining({ id: "prod-1", stock: 2 }),
		]);
	});

	it("should return recent pets with repository ordering and limit", async () => {
		const result = await sut.execute();

		expect(result.recentPets).toHaveLength(2);
		expect(result.recentPets[0].name).toBe("Rex");
	});

	it("should derive real operational metrics and history", async () => {
		const result = await sut.execute();

		expect(result.stats.todayAppointments).toBe(2);
		expect(result.stats.upcomingAppointments).toBe(1);
		expect(result.stats.completedAppointments).toBe(1);
		expect(result.stats.newClientsThisMonth).toBe(2);
		expect(result.operationalHistory).toEqual([
			{ appointments: 0, date: "2026-03-03", newClients: 0 },
			{ appointments: 0, date: "2026-03-04", newClients: 0 },
			{ appointments: 1, date: "2026-03-05", newClients: 0 },
			{ appointments: 0, date: "2026-03-06", newClients: 0 },
			{ appointments: 0, date: "2026-03-07", newClients: 1 },
			{ appointments: 0, date: "2026-03-08", newClients: 0 },
			{ appointments: 2, date: "2026-03-09", newClients: 1 },
		]);
	});

	it("should merge appointments and clients into a recent operational feed", async () => {
		const result = await sut.execute();

		expect(result.recentActivity).toHaveLength(6);
		expect(result.recentActivity[0]).toEqual(
			expect.objectContaining({
				id: "appointment-appt-3",
				kind: "appointment",
				occurredAt: mockAppointments[2].date.toISOString(),
				title: "Check-up confirmado",
				tone: "info",
			}),
		);
		expect(result.recentActivity[1]).toEqual(
			expect.objectContaining({
				id: "appointment-appt-2",
				title: "Tosa concluído",
				tone: "success",
			}),
		);
		expect(result.recentActivity).toContainEqual(
			expect.objectContaining({
				id: "client-u1",
				kind: "client",
				title: "Novo cliente cadastrado",
				tone: "success",
			}),
		);
	});

	it("should use explicit aggregation methods", async () => {
		await sut.execute();

		expect(stubs.petRepository.countAll).toHaveBeenCalledTimes(1);
		expect(stubs.petRepository.findRecent).toHaveBeenCalledWith(5);
		expect(stubs.appointmentRepository.countAll).toHaveBeenCalledTimes(1);
		expect(stubs.appointmentRepository.findAll).toHaveBeenCalledTimes(1);
		expect(stubs.userRepository.countClients).toHaveBeenCalledTimes(1);
		expect(stubs.userRepository.findClients).toHaveBeenCalledTimes(1);
		expect(stubs.productRepository.countAll).toHaveBeenCalledTimes(1);
		expect(stubs.productRepository.countLowStock).toHaveBeenCalledWith(5);
		expect(stubs.productRepository.findAll).toHaveBeenCalledTimes(1);
	});
});
