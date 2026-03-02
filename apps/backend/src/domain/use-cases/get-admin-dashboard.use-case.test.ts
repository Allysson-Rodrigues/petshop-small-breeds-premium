import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Pet } from "../entities/pet.entity.js";
import { ProductCategory } from "../entities/product.entity.js";
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

function makeStubs() {
	const petRepository: PetRepository = {
		findAll: vi.fn().mockResolvedValue(mockPets),
		findByUserId: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	};
	const appointmentRepository: AppointmentRepository = {
		findAll: vi.fn().mockResolvedValue([
			{
				id: "a1",
				date: new Date(),
				type: "Banho",
				status: "PENDING",
				userId: "u1",
				petId: "p1",
			},
		]),
		findByUserId: vi.fn(),
		create: vi.fn(),
		updateStatus: vi.fn(),
		delete: vi.fn(),
	};
	const userRepository: UserRepository = {
		findAll: vi.fn().mockResolvedValue([
			{
				id: "u1",
				name: "User 1",
				email: "u1@test.com",
				password: "h",
				role: "client",
				createdAt: new Date(),
			},
			{
				id: "u2",
				name: "User 2",
				email: "u2@test.com",
				password: "h",
				role: "admin",
				createdAt: new Date(),
			},
		]),
		create: vi.fn(),
		findByEmail: vi.fn(),
		findById: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	};
	const productRepository: ProductRepository = {
		findAll: vi.fn().mockResolvedValue([
			{
				id: "pr1",
				name: "Shampoo",
				description: "Dog shampoo",
				price: 29.9,
				category: ProductCategory.ACCESSORY,
				stock: 50,
			},
			{
				id: "pr2",
				name: "Ração",
				description: "Dog food",
				price: 89.9,
				category: ProductCategory.FOOD,
				stock: 3,
			},
			{
				id: "pr3",
				name: "Coleira",
				description: "Small collar",
				price: 45.0,
				category: ProductCategory.ACCESSORY,
				stock: 0,
			},
		]),
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
		stubs = makeStubs();
		sut = new GetAdminDashboardUseCase(
			stubs.petRepository,
			stubs.appointmentRepository,
			stubs.userRepository,
			stubs.productRepository,
		);
	});

	it("should return aggregated stats", async () => {
		const result = await sut.execute();

		expect(result.stats.totalPets).toBe(3);
		expect(result.stats.totalAppointments).toBe(1);
		expect(result.stats.totalClients).toBe(2);
		expect(result.stats.totalProducts).toBe(3);
	});

	it("should calculate low stock items (stock <= 5)", async () => {
		const result = await sut.execute();

		// "Ração" stock=3 and "Coleira" stock=0 => 2 low stock
		expect(result.stats.lowStockItems).toBe(2);
	});

	it("should return recent pets (max 5)", async () => {
		const result = await sut.execute();

		expect(result.recentPets).toHaveLength(3);
		expect(result.recentPets[0].name).toBe("Rex");
	});

	it("should call findAll on all repositories", async () => {
		await sut.execute();

		expect(stubs.petRepository.findAll).toHaveBeenCalledTimes(1);
		expect(stubs.appointmentRepository.findAll).toHaveBeenCalledTimes(1);
		expect(stubs.userRepository.findAll).toHaveBeenCalledTimes(1);
		expect(stubs.productRepository.findAll).toHaveBeenCalledTimes(1);
	});
});
