import { Order } from "./order.interface";

export interface CreditBlock {
    id: number;
    order: Order;
    blocked_amount: number;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}