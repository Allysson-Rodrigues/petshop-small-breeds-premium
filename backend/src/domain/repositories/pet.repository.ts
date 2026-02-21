import type { Pet } from "../entities/pet.entity.js";

export interface PetRepository {
	findByUserId(userId: string): Promise<Pet[]>;
	create(pet: Omit<Pet, "id">): Promise<Pet>;
}
