import { Pedido } from "./pedido.interface";
import { Producto } from "./producto.interface";

export interface DetallePedido {
    id: number;
    pedido: Pedido;
    producto: Producto;
    cantidad: number;
    precio_unitario: number;
    activo: boolean;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}