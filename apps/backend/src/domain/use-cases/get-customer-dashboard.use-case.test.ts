import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Appointment } from "../entities/appointment.entity.js";
import type { Pet } from "../entities/pet.entity.js";
import type { AppointmentRepository } from "../repositories/appointment.repository.js";
import type { PetRepository } from "../repositories/pet.repository.js";
import { GetCustomerDashboardUseCase } from "./get-customer-dashboard.use-case.js";

const mockPets: Pet[] = [
	{ id: "pet-1", name: "Rex", breed: "Poodle", age: 3, userId: "user-1" },
	{ id: "pet-2", name: "Luna", breed: "Shih Tzu", age: 2, userId: "user-1" },
];

const futureDate = new Date(Date.now() + 86400000 * 7); // 7 days from now
const pastDate = new Date(Date.now() - 86400000 * 7); // 7 days ago

const mockAppointments: Appointment[] = [
	{
		id: "a-1",
		date: pastDate,
		type: "Banho",
		status: "COMPLETED",
		userId: "user-1",
		petId: "pet-1",
	},
	{
		id: "a-2",
		date: futureDate,
		type: "Tosa",
		status: "PENDING",
		userId: "user-1",
		petId: "pet-2",
	},
];

function makeStubs() {
	const petRepository: PetRepository = {
		findAll: vi.fn(),
		findRecent: vi.fn(),
		countAll: vi.fn(),
		countByOwnerIds: vi.fn(),
		findById: vi.fn(),
		findByUserId: vi.fn().mockResolvedValue(mockPets),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	};
	const appointmentRepository: AppointmentRepository = {
		findAll: vi.fn(),
		countAll: vi.fn(),
		findById: vi.fn(),
		findByUserId: vi.fn().mockResolvedValue(mockAppointments),
		create: vi.fn(),
		updateStatus: vi.fn(),
		delete: vi.fn(),
	};
	return { petRepository, appointmentRepository };
}

describe("GetCustomerDashboardUseCase", () => {
	let sut: GetCustomerDashboardUseCase;
	let stubs: ReturnType<typeof makeStubs>;

	beforeEach(() => {
		stubs = makeStubs();
		sut = new GetCustomerDashboardUseCase(
			stubs.petRepository,
			stubs.appointmentRepository,
		);
	});

	it("should return pets, appointments and stats for a user", async () => {
		const result = await sut.execute("user-1");

		expect(result.pets).toHaveLength(2);
		expect(result.appointments).toHaveLength(2);
		expect(result.stats.totalPets).toBe(2);
		expect(result.stats.totalAppointments).toBe(2);
	});

	it("should find next future appointment", async () => {
		const result = await sut.execute("user-1");

		const nextAppointment = result.stats.nextAppointment;
		expect(nextAppointment).toBeTruthy();
		if (!nextAppointment) {
			throw new Error("nextAppointment should be defined");
		}
		expect(new Date(nextAppointment).getTime()).toBeGreaterThan(Date.now());
	});

	it("should return null nextAppointment when no future appointments", async () => {
		vi.mocked(stubs.appointmentRepository.findByUserId).mockResolvedValue([
			{
				id: "a-1",
				date: pastDate,
				type: "Banho",
				status: "COMPLETED",
				userId: "user-1",
				petId: "pet-1",
			},
		]);

		const result = await sut.execute("user-1");

		expect(result.stats.nextAppointment).toBeNull();
	});

	it("should query by userId", async () => {
		await sut.execute("user-1");

		expect(stubs.petRepository.findByUserId).toHaveBeenCalledWith("user-1");
		expect(stubs.appointmentRepository.findByUserId).toHaveBeenCalledWith(
			"user-1",
		);
	});
});
