import { Rol } from "./rol.interface";
import { Usuario } from "./usuario.interface";

export interface UsuarioRol {
    id: number;
    usuario: Usuario;
    rol: Rol;
    activo: boolean;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}