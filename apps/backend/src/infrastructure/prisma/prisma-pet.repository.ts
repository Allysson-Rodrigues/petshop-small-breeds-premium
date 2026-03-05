import type { Pet } from "../../domain/entities/pet.entity.js";
import type { PetRepository } from "../../domain/repositories/pet.repository.js";
import { prisma } from "./client.js";

export class PrismaPetRepository implements PetRepository {
	private prisma = prisma;

	async findAll(): Promise<Pet[]> {
		const pets = await this.prisma.pet.findMany({
			orderBy: { name: "asc" },
		});
		return pets as Pet[];
	}

	async findById(id: string): Promise<Pet | null> {
		const pet = await this.prisma.pet.findUnique({
			where: { id },
		});
		return (pet as Pet | null) ?? null;
	}

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

	async update(id: string, data: Partial<Omit<Pet, "id">>): Promise<Pet> {
		const updated = await this.prisma.pet.update({
			where: { id },
			data,
		});
		return updated as Pet;
	}

	async delete(id: string): Promise<void> {
		await this.prisma.pet.delete({ where: { id } });
	}
}
