import { Intercambio } from "./intercambio.interface";
import { EstadoIntercambio } from "./estado_intercambio.interface";

export interface HistorialIntercambio {
    id: number;
    intercambio: Intercambio;
    estado_anterior: EstadoIntercambio;
    nuevo_estado: EstadoIntercambio;
    activo: boolean;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}