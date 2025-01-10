import { Role } from "./role.interface";
import { User } from "./user.interface";

export interface UserRole {
    id: number;
    user: User;
    role: Role;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}