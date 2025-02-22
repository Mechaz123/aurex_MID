import { Pedido } from "./pedido.interface";

export interface HistorialTransaccion {
    id: number;
    tipo: string;
    monto: number;
    pedido: Pedido;
    confirmacion: boolean;
    activo: boolean;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}