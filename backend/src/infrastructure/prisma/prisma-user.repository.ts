import type { User } from "../../domain/entities/user.entity.js";
import type { UserRepository } from "../../domain/repositories/user.repository.js";
import { prisma } from "./client.js";

export class PrismaUserRepository implements UserRepository {
	private prisma = prisma;

	async create(user: Omit<User, "id" | "createdAt">): Promise<User> {
		const createdUser = await this.prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
			},
		});
		return createdUser as User;
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { email },
		});
		return user as User | null;
	}

	async findById(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});
		return user as User | null;
	}
}
