import { TransactionStatus } from "./transaction_status.interface";
import { User } from "./user.interface";

export interface Transaction {
    id: number;
    sender: User;
    receiver: User;
    transaction_type: string;
    transaction_status: TransactionStatus;
    created_at: Date;
    updated_at: Date;
}