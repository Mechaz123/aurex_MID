import { Producto } from "./producto.interface";
import { Usuario } from "./usuario.interface";

export interface Intercambio {
    id: number;
    usuario_solicitante: Usuario;
    producto_solicitante: Producto;
    cantidad_solicitada: number;
    usuario_ofertante: Usuario;
    producto_ofrecido: Producto;
    cantidad_ofrecida: number;
    activo: boolean;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}