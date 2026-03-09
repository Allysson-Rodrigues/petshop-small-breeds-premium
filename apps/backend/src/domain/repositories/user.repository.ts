import type { User } from "../entities/user.entity.js";

export interface UserRepository {
	findAll(): Promise<User[]>;
	findClients(): Promise<User[]>;
	countClients(): Promise<number>;
	create(user: Omit<User, "id" | "createdAt">): Promise<User>;
	findByEmail(email: string): Promise<User | null>;
	findById(id: string): Promise<User | null>;
	update(
		id: string,
		data: Partial<Omit<User, "id" | "createdAt">>,
	): Promise<User>;
	delete(id: string): Promise<void>;
}
