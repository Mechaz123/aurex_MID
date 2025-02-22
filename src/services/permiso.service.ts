import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { Permiso } from 'src/interfaces/permiso.interface';

@Injectable()
export class PermisoService {
    constructor(
        private readonly utilsService: UtilsService,
    ) { }

    async PermisosActivo(token: string): Promise<Permiso[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const todosPermisos = await this.utilsService.SendGet<Permiso[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "permiso", headers);
        const permisosActivos = todosPermisos.filter(permiso => permiso.activo);
        return permisosActivos;
    }
}
