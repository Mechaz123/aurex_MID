import { Permiso } from "./permiso.interface";
import { Rol } from "./rol.interface";

export interface RolPermiso {
    id: number;
    rol: Rol;
    permiso: Permiso;
    activo: boolean;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}