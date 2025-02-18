import { Order } from "./order.interface";

export interface TransactionHistory {
    id: number;
    type: string;
    amount: number;
    active: boolean;
    created_at: Date;
    updated_at: Date;
    order: Order;
}