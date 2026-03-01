import type { Pet } from "../entities/pet.entity.js";

export interface PetRepository {
	findAll(): Promise<Pet[]>;
	findByUserId(userId: string): Promise<Pet[]>;
	create(pet: Omit<Pet, "id">): Promise<Pet>;
	update(id: string, data: Partial<Omit<Pet, "id">>): Promise<Pet>;
	delete(id: string): Promise<void>;
}
