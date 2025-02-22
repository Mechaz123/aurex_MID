import { Usuario } from "./usuario.interface";

export interface Credito {
    id: number;
    usuario: Usuario;
    monto: number;
    activo: boolean;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}