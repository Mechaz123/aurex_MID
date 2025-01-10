import { Category } from "./category.interface";
import { ProductStatus } from "./product_status.interface";
import { User } from "./user.interface";

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    image_url: string;
    owner: User;
    category: Category;
    product_status: ProductStatus;
    created_at: Date;
    updated_at: Date;
}