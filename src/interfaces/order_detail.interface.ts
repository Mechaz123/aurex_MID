import { Order } from "./order.interface";
import { Product } from "./product.interface";

export interface OrderDetail {
    id: number;
    order: Order;
    product: Product;
    quantity: number;
    unit_price: number;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}