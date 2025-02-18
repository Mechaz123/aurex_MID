import { User } from "./user.interface";

export interface Credit {
    id: number;
    user: User;
    amount: number;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}