import { Categoria } from "./categoria.interface";
import { EstadoProducto } from "./estado_producto.interface";
import { Usuario } from "./usuario.interface";

export interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    existencias: number;
    imagen_url: string;
    destino: string;
    propietario: Usuario;
    categoria: Categoria;
    estado_producto: EstadoProducto;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}