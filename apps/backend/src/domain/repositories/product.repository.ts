import type { Product } from "../entities/product.entity.js";

export interface ProductRepository {
	findAll(): Promise<Product[]>;
	findById(id: string): Promise<Product | null>;
	create(product: Omit<Product, "id">): Promise<Product>;
	update(id: string, data: Partial<Omit<Product, "id">>): Promise<Product>;
	delete(id: string): Promise<void>;
}
