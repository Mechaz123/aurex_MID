export interface Permiso {
    id: number;
    nombre: string;
    descripcion?: string;
    recurso: string;
    accion: string;
    activo: boolean;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}