import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { CreditoService } from './credito.service';
import { Producto } from 'src/interfaces/producto.interface';
import { EstadoPedido } from 'src/interfaces/estado_pedido.interface';
import { Pedido } from 'src/interfaces/pedido.interface';
import { DetallePedido } from 'src/interfaces/detalle_pedido.interface';
import { CreditoBloqueado } from 'src/interfaces/credito_bloqueado.interface';
import { HistorialTransaccion } from 'src/interfaces/historial_transaccion.interface';
import { Credito } from 'src/interfaces/credito.interface';
import { EmailService } from './email.service';

@Injectable()
export class PedidoService {
    constructor(
        private readonly utilsService: UtilsService,
        private readonly creditoService: CreditoService,
        private readonly emailService: EmailService
    ) { }

    async CrearCompra(body: any, token: string) {
        const headers = { Authorization: `Bearer ${token}` };
        const cantidadComprada = body.cantidad;
        const totalPago = body.totalPago;
        const creditoUsuario = await this.creditoService.ConsultarMonto(body.idUsuario, token);

        if (creditoUsuario) {
            const productoComprado = await this.utilsService.SendGet<Producto>(process.env.AUREX_MID_AUREX_CRUD_URL, `producto/${body.idProducto}`, headers);

            if (productoComprado) {
                const todosEstadosPedido = await this.utilsService.SendGet<EstadoPedido[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "estado_pedido", headers);

                if (todosEstadosPedido.length > 0) {
                    const estadoPedidoActivo = todosEstadosPedido.find(estadoPedido => (estadoPedido.nombre == "Activo") && estadoPedido.activo);
            
                    if (estadoPedidoActivo) {
                        const dataPedido = {
                            "usuario": creditoUsuario.usuario,
                            "monto_total": totalPago,
                            "estado_pedido": estadoPedidoActivo
                        }

                        const pedidoCreado = await this.utilsService.SendPost<Pedido, Partial<Pedido>>(process.env.AUREX_MID_AUREX_CRUD_URL, `pedido`, dataPedido, headers);

                        if (pedidoCreado) {
                            const dataDetallePedido = {
                                "cantidad": cantidadComprada,
                                "precio_unitario": productoComprado.precio,
                                "pedido": pedidoCreado,
                                "producto": productoComprado
                            }
                            
                            const detallePedidoCreado = await this.utilsService.SendPost<DetallePedido, Partial<DetallePedido>>(process.env.AUREX_MID_AUREX_CRUD_URL, `detalle_pedido`, dataDetallePedido, headers);

                            if (!detallePedidoCreado) {
                                throw new Error("No se pudo crear el detalle del pedido.");
                            }

                            const dataCreditoBloqueado = {
                                "monto_bloqueado": totalPago,
                                "pedido": pedidoCreado
                            }

                            const creditoBloqueadoCreado = await this.utilsService.SendPost<CreditoBloqueado, Partial<CreditoBloqueado>>(process.env.AUREX_MID_AUREX_CRUD_URL, `credito_bloqueado`, dataCreditoBloqueado, headers);

                            if (creditoBloqueadoCreado) {
                                const descuento = (Number(creditoUsuario.monto) - Number(totalPago)).toFixed(2);
                                const creditoUsuarioActualizado = {
                                    "monto": Number(descuento)
                                }

                                const creditoModificado = await this.utilsService.SendPut<Credito, Partial<Credito>>(process.env.AUREX_MID_AUREX_CRUD_URL, `credito/${creditoUsuario.id}`, creditoUsuarioActualizado, headers);

                                if (!creditoModificado) {
                                    throw new Error("No se pudo modificar el credito del usuario.");
                                }
                            } else {
                                throw new Error("No se pudo crear el credito bloqueado.");
                            }

                            let dataHistorialTransaccion = {
                                "tipo": "Compra",
                                "monto": totalPago,
                                "pedido": pedidoCreado,
                                "confirmacion": true,
                            }

                            const historialTransaccionCompradorCreado = await this.utilsService.SendPost<HistorialTransaccion, Partial<HistorialTransaccion>>(process.env.AUREX_MID_AUREX_CRUD_URL, `historial_transaccion`, dataHistorialTransaccion, headers);

                            if (!historialTransaccionCompradorCreado) {
                                throw new Error("No se pudo crear el historial de transacción para el comprador.");
                            }

                            dataHistorialTransaccion.tipo = "Venta";
                            dataHistorialTransaccion.confirmacion = false;

                            const historialTransaccionVendedorCreado = await this.utilsService.SendPost<HistorialTransaccion, Partial<HistorialTransaccion>>(process.env.AUREX_MID_AUREX_CRUD_URL, `historial_transaccion`, dataHistorialTransaccion, headers);

                            if (!historialTransaccionVendedorCreado) {
                                throw new Error("No se pudo crear el historial de transacción para el vendedor.");
                            }

                            await this.emailService.EnviarEmail(creditoUsuario.usuario.correo, "GENERACIÓN DE SOLICITUD DE COMPRA", null);
                            await this.emailService.EnviarEmail(productoComprado.propietario.correo, "GENERACIÓN DE SOLICITUD DE VENTA", null);

                        } else {
                            throw new Error("No se pudo crear el pedido.");
                        }
                    } else {
                        throw new Error("No se pudo obtener el estado de pedido activo.");
                    }
                } else {
                    throw new Error("No se pudo obtener todos los estados de pedidos.");
                }
            } else {
                throw new Error("No se pudo obtener el producto comprado.");
            }
        } else {
            throw new Error("No se pudo obtener el credito del usuario.");
        }
    }
}
