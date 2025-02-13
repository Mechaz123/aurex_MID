import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { Permission } from 'src/interfaces/permission.interface';

@Injectable()
export class PermissionService {
    constructor(
        private readonly utilsService: UtilsService,
    ) { }

    async PermissionActive(token: string): Promise<Permission[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const allPermissions = await this.utilsService.SendGet<Permission[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "permission", headers);
        const permissionsActive = allPermissions.filter(permission => permission.active);
        return permissionsActive;
    }
}
