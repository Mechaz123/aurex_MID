import { Product } from "./product.interface";
import { User } from "./user.interface";

export interface Exchange {
    id: number;
    requesting_user: User;
    requesting_product: Product;
    quantity_requested: number;
    receiving_user: User;
    receiving_product: Product;
    quantity_receiving: number;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}