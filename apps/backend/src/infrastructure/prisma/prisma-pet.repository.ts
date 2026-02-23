import type { Pet } from "../../domain/entities/pet.entity.js";
import type { PetRepository } from "../../domain/repositories/pet.repository.js";
import { prisma } from "./client.js";

export class PrismaPetRepository implements PetRepository {
	private prisma = prisma;

	async findByUserId(userId: string): Promise<Pet[]> {
		const pets = await this.prisma.pet.findMany({
			where: { userId },
		});
		return pets as Pet[];
	}

	async create(pet: Omit<Pet, "id">): Promise<Pet> {
		const createdPet = await this.prisma.pet.create({
			data: {
				name: pet.name,
				breed: pet.breed,
				age: pet.age,
				userId: pet.userId,
			},
		});
		return createdPet as Pet;
	}
}
