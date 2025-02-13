import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { RolePermission } from 'src/interfaces/role_permission.interface';

@Injectable()
export class RoleService {
    constructor(
        private readonly utilService: UtilsService,
    ) { }

    async getRolePermission(id: string, token: string) {
        const headers = { Authorization: `Bearer ${token}`};
        const allRolePermission = await this.utilService.SendGet<RolePermission[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "role_permission", headers);
        const rolePermission = allRolePermission.filter(rolePermission => (rolePermission.role.id == Number(id)));
        return rolePermission;
    }
}
