import { Permission } from "./permission.interface";
import { Role } from "./role.interface";

export interface RolePermission {
    id: number;
    role: Role;
    permission: Permission;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}