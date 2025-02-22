import { Subasta } from "./subasta.interface";
import { Usuario } from "./usuario.interface";

export interface Puja {
    id: number;
    subasta: Subasta;
    usuario: Usuario;
    monto: number;
    activo: boolean;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}