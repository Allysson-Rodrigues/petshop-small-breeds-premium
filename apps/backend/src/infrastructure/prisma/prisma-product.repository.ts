import type { Product } from "../../domain/entities/product.entity.js";
import type { ProductRepository } from "../../domain/repositories/product.repository.js";
import { prisma } from "./client.js";

export class PrismaProductRepository implements ProductRepository {
	private prisma = prisma;

	async findAll(): Promise<Product[]> {
		const products = await this.prisma.product.findMany({
			orderBy: { name: "asc" },
		});
		return products as unknown as Product[];
	}

	async countAll(): Promise<number> {
		return this.prisma.product.count();
	}

	async countLowStock(threshold: number): Promise<number> {
		return this.prisma.product.count({
			where: {
				stock: {
					lte: threshold,
				},
			},
		});
	}

	async findById(id: string): Promise<Product | null> {
		const product = await this.prisma.product.findUnique({
			where: { id },
		});
		return product as unknown as Product | null;
	}

	async create(product: Omit<Product, "id">): Promise<Product> {
		const created = await this.prisma.product.create({
			data: {
				name: product.name,
				description: product.description,
				price: product.price,
				category: product.category,
				stock: product.stock,
			},
		});
		return created as unknown as Product;
	}

	async update(
		id: string,
		data: Partial<Omit<Product, "id">>,
	): Promise<Product> {
		const updated = await this.prisma.product.update({
			where: { id },
			data,
		});
		return updated as unknown as Product;
	}

	async delete(id: string): Promise<void> {
		await this.prisma.product.delete({ where: { id } });
	}
}
