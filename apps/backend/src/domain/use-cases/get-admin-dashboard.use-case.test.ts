import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Pet } from "../entities/pet.entity.js";
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
		findAll: vi.fn(),
		countAll: vi.fn().mockResolvedValue(1),
		findById: vi.fn(),
		findByUserId: vi.fn(),
		create: vi.fn(),
		updateStatus: vi.fn(),
		delete: vi.fn(),
	};
	const userRepository: UserRepository = {
		findAll: vi.fn(),
		findClients: vi.fn(),
		countClients: vi.fn().mockResolvedValue(1),
		create: vi.fn(),
		findByEmail: vi.fn(),
		findById: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	};
	const productRepository: ProductRepository = {
		findAll: vi.fn(),
		countAll: vi.fn().mockResolvedValue(3),
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
		expect(result.stats.totalClients).toBe(1);
		expect(result.stats.totalProducts).toBe(3);
	});

	it("should calculate low stock items (stock <= 5)", async () => {
		const result = await sut.execute();

		expect(result.stats.lowStockItems).toBe(2);
	});

	it("should return recent pets with repository ordering and limit", async () => {
		const result = await sut.execute();

		expect(result.recentPets).toHaveLength(2);
		expect(result.recentPets[0].name).toBe("Rex");
	});

	it("should use explicit aggregation methods", async () => {
		await sut.execute();

		expect(stubs.petRepository.countAll).toHaveBeenCalledTimes(1);
		expect(stubs.petRepository.findRecent).toHaveBeenCalledWith(5);
		expect(stubs.appointmentRepository.countAll).toHaveBeenCalledTimes(1);
		expect(stubs.userRepository.countClients).toHaveBeenCalledTimes(1);
		expect(stubs.productRepository.countAll).toHaveBeenCalledTimes(1);
		expect(stubs.productRepository.countLowStock).toHaveBeenCalledWith(5);
	});
});
