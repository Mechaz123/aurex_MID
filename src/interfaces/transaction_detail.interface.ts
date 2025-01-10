import { Product } from "./product.interface";
import { Transaction } from "./transaction.interface";

export interface TransactionDetail {
    id: number;
    transaction: Transaction;
    product: Product;
    quantity: number;
    unit_price: number;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}