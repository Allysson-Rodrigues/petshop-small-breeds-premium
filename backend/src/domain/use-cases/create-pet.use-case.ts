import type { Pet } from "../entities/pet.entity.js";
import type { PetRepository } from "../repositories/pet.repository.js";

interface CreatePetParams {
	name: string;
	breed: string;
	age: number;
	userId: string;
}

export class CreatePetUseCase {
	constructor(private readonly petRepository: PetRepository) {}

	async execute(params: CreatePetParams): Promise<Pet> {
		return this.petRepository.create(params);
	}
}
