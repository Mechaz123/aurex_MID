import { EstadoPedido } from "./estado_pedido.interface";
import { Usuario } from "./usuario.interface";

export interface Pedido {
    id: number;
    usuario: Usuario;
    fecha_orden: Date;
    monto_total: number;
    estado_pedido: EstadoPedido;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}