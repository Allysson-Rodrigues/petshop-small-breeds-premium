import type { User } from "../../domain/entities/user.entity.js";
import type { UserRepository } from "../../domain/repositories/user.repository.js";
import { prisma } from "./client.js";

export class PrismaUserRepository implements UserRepository {
	private prisma = prisma;

	async findAll(): Promise<User[]> {
		const users = await this.prisma.user.findMany({
			orderBy: { createdAt: "desc" },
		});
		return users as User[];
	}

	async create(user: Omit<User, "id" | "createdAt">): Promise<User> {
		const createdUser = await this.prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
				role: user.role,
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

	async update(
		id: string,
		data: Partial<Omit<User, "id" | "createdAt">>,
	): Promise<User> {
		const updated = await this.prisma.user.update({
			where: { id },
			data,
		});
		return updated as User;
	}

	async delete(id: string): Promise<void> {
		await this.prisma.user.delete({ where: { id } });
	}
}
