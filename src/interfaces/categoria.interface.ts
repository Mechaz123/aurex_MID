export interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
    categoria_principal: Categoria;
    activo: boolean;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}