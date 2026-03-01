import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AppointmentRepository } from "../repositories/appointment.repository.js";
import { CreateAppointmentUseCase } from "./create-appointment.use-case.js";

function makeStubs() {
	const appointmentRepository: AppointmentRepository = {
		findAll: vi.fn(),
		findByUserId: vi.fn(),
		create: vi.fn().mockImplementation(async (data) => ({
			id: "appt-1",
			status: "PENDING",
			...data,
		})),
		updateStatus: vi.fn(),
		delete: vi.fn(),
	};
	return { appointmentRepository };
}

describe("CreateAppointmentUseCase", () => {
	let sut: CreateAppointmentUseCase;
	let stubs: ReturnType<typeof makeStubs>;

	beforeEach(() => {
		stubs = makeStubs();
		sut = new CreateAppointmentUseCase(stubs.appointmentRepository);
	});

	it("should create an appointment and return it", async () => {
		const params = {
			date: new Date("2026-04-01T10:00:00Z"),
			type: "Banho",
			userId: "user-1",
			petId: "pet-1",
		};

		const result = await sut.execute(params);

		expect(result.id).toBe("appt-1");
		expect(result.type).toBe("Banho");
		expect(result.status).toBe("PENDING");
		expect(stubs.appointmentRepository.create).toHaveBeenCalledWith(params);
	});

	it("should delegate creation to the repository", async () => {
		const params = {
			date: new Date("2026-05-10T14:00:00Z"),
			type: "Tosa",
			userId: "user-2",
			petId: "pet-3",
		};

		await sut.execute(params);

		expect(stubs.appointmentRepository.create).toHaveBeenCalledTimes(1);
	});
});
