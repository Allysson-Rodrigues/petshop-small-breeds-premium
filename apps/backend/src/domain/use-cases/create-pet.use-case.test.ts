import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PetRepository } from "../repositories/pet.repository.js";
import { CreatePetUseCase } from "./create-pet.use-case.js";

function makeStubs() {
	const petRepository: PetRepository = {
		findAll: vi.fn(),
		findRecent: vi.fn(),
		countAll: vi.fn(),
		countByOwnerIds: vi.fn(),
		findById: vi.fn(),
		findByUserId: vi.fn(),
		create: vi.fn().mockImplementation(async (data) => ({
			id: "pet-1",
			...data,
		})),
		update: vi.fn(),
		delete: vi.fn(),
	};
	return { petRepository };
}

describe("CreatePetUseCase", () => {
	let sut: CreatePetUseCase;
	let stubs: ReturnType<typeof makeStubs>;

	beforeEach(() => {
		stubs = makeStubs();
		sut = new CreatePetUseCase(stubs.petRepository);
	});

	it("should create a pet and return it with an id", async () => {
		const params = { name: "Rex", breed: "Poodle", age: 3, userId: "user-1" };

		const result = await sut.execute(params);

		expect(result.id).toBe("pet-1");
		expect(result.name).toBe("Rex");
		expect(result.breed).toBe("Poodle");
		expect(stubs.petRepository.create).toHaveBeenCalledWith(params);
	});

	it("should delegate creation to the repository", async () => {
		const params = {
			name: "Bella",
			breed: "Shih Tzu",
			age: 5,
			userId: "user-2",
		};

		await sut.execute(params);

		expect(stubs.petRepository.create).toHaveBeenCalledTimes(1);
	});
});
