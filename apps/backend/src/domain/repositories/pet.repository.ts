import type { Pet } from "../entities/pet.entity.js";

export interface PetRepository {
	findAll(): Promise<Pet[]>;
	findRecent(limit: number): Promise<Pet[]>;
	countAll(): Promise<number>;
	countByOwnerIds(userIds: string[]): Promise<Record<string, number>>;
	findById(id: string): Promise<Pet | null>;
	findByUserId(userId: string): Promise<Pet[]>;
	create(pet: Omit<Pet, "id">): Promise<Pet>;
	update(id: string, data: Partial<Omit<Pet, "id">>): Promise<Pet>;
	delete(id: string): Promise<void>;
}
