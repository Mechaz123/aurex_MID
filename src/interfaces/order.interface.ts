import { OrderStatus } from "./order_status.interface";
import { User } from "./user.interface";

export interface Order {
    id: number;
    user: User;
    order_date: Date;
    total_amount: number;
    order_status: OrderStatus;
    created_at: Date;
    updated_at: Date;
}