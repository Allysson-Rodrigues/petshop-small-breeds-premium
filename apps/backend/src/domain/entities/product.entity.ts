export enum ProductCategory {
	FOOD = "FOOD",
	ACCESSORY = "ACCESSORY",
}

export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	category: ProductCategory;
	stock: number;
}
