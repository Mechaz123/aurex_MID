export interface EstadoSubasta {
    id: number;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}