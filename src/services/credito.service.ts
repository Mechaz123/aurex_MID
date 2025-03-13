import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { Rol } from 'src/interfaces/rol.interface';
import { UsuarioRol } from 'src/interfaces/usuario_rol.interface';
import { Credito } from 'src/interfaces/credito.interface';

@Injectable()
export class CreditoService {
    constructor(
        private readonly utilsService: UtilsService
    ) { }

    async VerificarRolesPropietario(id: string, token: string): Promise<boolean> {
        const headers = { Authorization: `Bearer ${token}`};
        const todosRoles = await this.utilsService.SendGet<Rol[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "rol", headers);
        const rolesNecesarios = todosRoles.filter(rol => (rol.nombre == "Comprador") || (rol.nombre == "Vendedor"));
        const todosUsuarioRoles = await this.utilsService.SendGet<UsuarioRol[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "usuario_rol", headers);
        const usuarioRoles = todosUsuarioRoles.filter(usuarioRol => (usuarioRol.usuario.id == Number(id)) && (usuarioRol.activo));

        for (const usuarioRol of usuarioRoles) {
            for (const rolNecesario of rolesNecesarios) {
                if (usuarioRol.rol.id == rolNecesario.id) {
                    return true;
                }
            }
        }
        return false;
    }

    async VerificarRegistro(id: string, token: string): Promise<boolean> {
        const headers = { Authorization: `Bearer ${token}`};
        const todosCreditos = await this.utilsService.SendGet<Credito[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "credito", headers);
        const creditoUsuario = todosCreditos.filter(credito => (credito.usuario.id == Number(id)));

        if (!creditoUsuario || creditoUsuario.length == 0) {
            return true;
        }
        return false;
    }

    async ConsultarMonto(id: string, token: string): Promise<Credito>{
        const headers = { Authorization: `Bearer ${token}`};
        const todosCreditos = await this.utilsService.SendGet<Credito[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "credito", headers);
        const creditoUsuario = todosCreditos.find(credito => (credito.usuario.id) == Number(id));
        return creditoUsuario;
    }
}
