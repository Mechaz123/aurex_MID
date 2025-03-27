import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { Producto } from 'src/interfaces/producto.interface';
import { Intercambio } from 'src/interfaces/intercambio.interface';
import { EstadoIntercambio } from 'src/interfaces/estado_intercambio.interface';
import { HistorialIntercambio } from 'src/interfaces/historial_intercambio.interface';
import { EmailService } from './email.service';
import { Usuario } from 'src/interfaces/usuario.interface';

@Injectable()
export class IntercambioService {
    constructor(
        private readonly utilsService: UtilsService,
        private readonly emailService: EmailService
    ) { }

    async VerificarRequisitos(id: string, token: string): Promise<boolean> {
        const headers = { Authorization: `Bearer ${token}`};
        const todosProductos = await this.utilsService.SendGet<Producto[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `producto`, headers);
        const productosIntercambio = todosProductos.filter(producto => (producto.propietario.id == Number(id)) && (producto.destino == "Intercambio") && (producto.estado_producto.nombre != "Inactivo"));

        if (productosIntercambio.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    async HistorialIntercambio(id: string, token: string): Promise<HistorialIntercambio[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const todosHistorialIntercambio = await this.utilsService.SendGet<HistorialIntercambio[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `historial_intercambio`, headers);
        const HistorialIntercambio = todosHistorialIntercambio.filter(historialIntercambio => (historialIntercambio.intercambio.usuario_ofertante.id == Number(id)) || (historialIntercambio.intercambio.usuario_solicitante.id == Number(id)));

        return HistorialIntercambio;
    }

    async CrearSolicitud(body: Partial<any>, token: string) {
        const headers = { Authorization: `Bearer ${token}`};
        
        const intercambioCreado = await this.utilsService.SendPost<Intercambio, Partial<Intercambio>>(process.env.AUREX_MID_AUREX_CRUD_URL, `intercambio`, body, headers);

        if (intercambioCreado) {
            const todosEstadosIntercambio = await this.utilsService.SendGet<EstadoIntercambio[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `estado_intercambio`, headers);

            if (todosEstadosIntercambio) {
                const estadoIntercambioActivo = todosEstadosIntercambio.find(estadoIntercambio => (estadoIntercambio.nombre == "Activo") && (estadoIntercambio.activo));

                const dataHistorialIntercambio = {
                    intercambio: intercambioCreado,
                    estado_anterior: estadoIntercambioActivo,
                    nuevo_estado: estadoIntercambioActivo
                }

                const historialIntercambioCreado = await this.utilsService.SendPost<HistorialIntercambio, Partial<HistorialIntercambio>>(process.env.AUREX_MID_AUREX_CRUD_URL, `historial_intercambio`, dataHistorialIntercambio, headers);

                if (historialIntercambioCreado) {
                    const usuario = await this.utilsService.SendGet<Usuario>(process.env.AUREX_MID_AUREX_CRUD_URL, `usuario/${intercambioCreado.usuario_solicitante.id}`, headers);

                    if (!usuario) {
                        throw new Error("No se pudo consultar el usuario.");
                    }
                    await this.emailService.EnviarEmail(usuario.correo, "NUEVA SOLICITUD DE INTERCAMBIO", null);
                } else {
                    throw new Error("No se pudo crear el historial de intercambio.");
                }
            } else {
                throw new Error("No se pudo obtener los estados de intercambio.");
            }
        } else {
            throw new Error("No se pudo crear la solicitud de intercambio.");
        }
    }

    async RechazarSolicitud(id: string, token: string) {
        const headers = { Authorization: `Bearer ${token}`};
        let historialIntercambio = await this.utilsService.SendGet<HistorialIntercambio>(process.env.AUREX_MID_AUREX_CRUD_URL, `historial_intercambio/${id}`, headers);

        if (historialIntercambio) {
            const todosEstadosIntercambio = await this.utilsService.SendGet<EstadoIntercambio[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `estado_intercambio`, headers);

            if(todosEstadosIntercambio) {
                const estadoIntercambioRechazado = todosEstadosIntercambio.find(estadoIntercambio => (estadoIntercambio.nombre == "Rechazado") && (estadoIntercambio.activo));
                historialIntercambio.nuevo_estado = estadoIntercambioRechazado;
                const historialIntercambioActualizado = await this.utilsService.SendPut<HistorialIntercambio, HistorialIntercambio>(process.env.AUREX_MID_AUREX_CRUD_URL, `historial_intercambio/${id}`, historialIntercambio, headers);

                if (!historialIntercambioActualizado) {
                    throw new Error("No se pudo actualizar el historial de intercambio.");
                }

                await this.emailService.EnviarEmail(historialIntercambio.intercambio.usuario_ofertante.correo, "SOLICITUD DE INTERCAMBIO RECHAZADA", null);
            } else {
                throw new Error("No se pudo obtener los estados de intercambio.");
            }
        } else {
            throw new Error("No se pudo consultar el historial de intercambio.");
        }
    }

    async AceptarSolicitud(id: string, token: string) {
        const headers = { Authorization: `Bearer ${token}`};
        let historialIntercambio = await this.utilsService.SendGet<HistorialIntercambio>(process.env.AUREX_MID_AUREX_CRUD_URL, `historial_intercambio/${id}`, headers);

        if (historialIntercambio) {
            const todosEstadosIntercambio = await this.utilsService.SendGet<EstadoIntercambio[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `estado_intercambio`, headers);

            if(todosEstadosIntercambio) {
                const estadoIntercambioAceptado = todosEstadosIntercambio.find(estadoIntercambio => (estadoIntercambio.nombre == "Aceptado") && (estadoIntercambio.activo));
                historialIntercambio.nuevo_estado = estadoIntercambioAceptado;
                const historialIntercambioActualizado = await this.utilsService.SendPut<HistorialIntercambio, HistorialIntercambio>(process.env.AUREX_MID_AUREX_CRUD_URL, `historial_intercambio/${id}`, historialIntercambio, headers);

                if (!historialIntercambioActualizado) {
                    throw new Error("No se pudo actualizar el historial de intercambio.");
                }

                await this.emailService.EnviarEmail(historialIntercambio.intercambio.usuario_ofertante.correo, "SOLICITUD DE INTERCAMBIO ACEPTADA", null);
            } else {
                throw new Error("No se pudo obtener los estados de intercambio.");
            }
        } else {
            throw new Error("No se pudo consultar el historial de intercambio.");
        }
    }
}
