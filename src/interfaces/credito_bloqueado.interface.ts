import { Pedido } from "./pedido.interface";

export interface CreditoBloqueado {
    id: number;
    pedido: Pedido;
    monto_bloqueado: number;
    activo: boolean;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}