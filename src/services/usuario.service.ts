import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { EstadoUsuario } from 'src/interfaces/estado_usuario.interface';
import { Usuario } from 'src/interfaces/usuario.interface';
import { error } from 'console';
import { AutenticacionService } from './autenticacion.service';
import { UsuarioRol } from 'src/interfaces/usuario_rol.interface';
import { RolPermiso } from 'src/interfaces/rol_permiso.interface';

@Injectable()
export class UsuarioService {
    constructor(
        private readonly utilsService: UtilsService,
        private authService: AutenticacionService
    ) { }

    async UsuariosActivos(token: string): Promise<Usuario[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const todosEstadosUsuario = await this.utilsService.SendGet<EstadoUsuario[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "estado_usuario", headers);
        const todosUsuarios = await this.utilsService.SendGet<Usuario[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "usuario", headers);
        const estadoUsuario = todosEstadosUsuario.find(estadoUsuario => estadoUsuario.nombre == "Activo" && estadoUsuario.activo);

        if (estadoUsuario != undefined) {
            const usuariosActivos = todosUsuarios.filter(usuario => usuario.estado_usuario.id == estadoUsuario.id);
            return usuariosActivos;
        } else {
            return new error;
        }
    }

    async AutenticacionUsuario(body: any): Promise<any> {
        const todosEstadosUsuario = await this.utilsService.SendGet<EstadoUsuario[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "autenticacion/estado_usuario");
        const estadoUsuario = todosEstadosUsuario.find(estadoUsuario => estadoUsuario.nombre == "Activo" && estadoUsuario.activo);
        const usuarioData = await this.utilsService.SendGet<Usuario>(process.env.AUREX_MID_AUREX_CRUD_URL, `autenticacion/usuario/${body.id}`);

        if (estadoUsuario != undefined && usuarioData != undefined) {
            if ((body.nombre_usuario === usuarioData.nombre_usuario) && usuarioData.estado_usuario.id === estadoUsuario.id && (body.clave == usuarioData.clave)) {
                const token = await this.authService.generarToken(body.id);
                return { token };
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    async Usuario(id: string, token: string): Promise<Usuario> {
        const headers = { Authorization: `Bearer ${token}`};
        let usuarioData = await this.utilsService.SendGet<Usuario>(process.env.AUREX_MID_AUREX_CRUD_URL, `usuario/${id}`, headers);
        usuarioData.clave = null;
        return usuarioData;
    }

    async UsuariosTodos(token: string): Promise<any> {
        let dataUsuarios =[];
        const headers = { Authorization: `Bearer ${token}`};
        const usuariosTodosData = await this.utilsService.SendGet<Usuario[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `usuario`, headers);

        for (let data of usuariosTodosData) {
            data.clave = null;
            dataUsuarios.push(data);
        }
        return dataUsuarios;
    }

    async MenuOpciones(id: string, token: string): Promise<any> {
        let dataRolPermiso = [];
        let opciones = [];
        const headers = { Authorization: `Bearer ${token}`};
        const todosUsuariosRoles = await this.utilsService.SendGet<UsuarioRol[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "usuario_rol", headers);
        const todosRolesPermisos = await this.utilsService.SendGet<RolPermiso[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "rol_permiso", headers);
        const usuarioRol = todosUsuariosRoles.filter(usuarioRol => usuarioRol.usuario.id == Number(id) && usuarioRol.activo && usuarioRol.rol.activo);

        for (const dataUsuarioRol of usuarioRol) {
            let rolPermiso = todosRolesPermisos.filter(rolPermiso => (rolPermiso.activo) && (rolPermiso.rol.id == dataUsuarioRol.rol.id));
            dataRolPermiso.push(rolPermiso);
        }

        for (const RolPermiso of dataRolPermiso) {
            for(const data of RolPermiso) {
                opciones.push(data.permiso.recurso);
            }
        }
        
        return opciones;
    }
    
    async UsuarioRoles(id: string, token: string): Promise<UsuarioRol[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const todosUsuariosRoles = await this.utilsService.SendGet<UsuarioRol[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "usuario_rol", headers);
        const usuarioRoles = todosUsuariosRoles.filter(usuarioRol => usuarioRol.usuario.id == Number(id));
        return usuarioRoles;
    }
}