import { EstadoSubasta } from "./estado_subasta.interface";
import { Producto } from "./producto.interface";

export interface Subasta {
    id: number;
    producto: Producto;
    precio_inicial: number;
    precio_actual: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    estado_subasta: EstadoSubasta;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}