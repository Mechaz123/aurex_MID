import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { RolPermiso } from 'src/interfaces/rol_permiso.interface';
import { Rol } from 'src/interfaces/rol.interface';

@Injectable()
export class RolService {
    constructor(
        private readonly utilsService: UtilsService,
    ) { }

    async getRolPermisos(id: string, token: string) {
        const headers = { Authorization: `Bearer ${token}`};
        const todosRolPermiso = await this.utilsService.SendGet<RolPermiso[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "rol_permiso", headers);
        const rolPermiso = todosRolPermiso.filter(rolPermiso => (rolPermiso.rol.id == Number(id)));
        return rolPermiso;
    }

    async getRolesActivos(token: string) {
        const headers = { Authorization: `Bearer ${token}`};
        const todosRoles = await this.utilsService.SendGet<Rol[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "rol", headers);
        const rolesActivos = todosRoles.filter(rol => (rol.activo))
        return rolesActivos;
    }
}
