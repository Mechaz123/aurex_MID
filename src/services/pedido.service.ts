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
                                "confirmacion": false,
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

    async ProductosPedidoPropietario(id: string, token: string): Promise<DetallePedido[]> {
        const headers = { Authorization: `Bearer ${token}` };
        const todosEstadoPedido = await this.utilsService.SendGet<EstadoPedido[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `estado_pedido`, headers);
        const estadoPedidoEntregado = todosEstadoPedido.find(estadoPedido => (estadoPedido.nombre == "Entregado") && estadoPedido.activo);
        const todosDetallePedido = await this.utilsService.SendGet<DetallePedido[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `detalle_pedido`, headers);
        const detallePedidosPropietarioProducto = todosDetallePedido.filter( detallePedido => (detallePedido.producto.propietario.id == Number(id)) && (detallePedido.pedido.estado_pedido.id != estadoPedidoEntregado.id));

        for (const detallePedido of detallePedidosPropietarioProducto) {
            detallePedido.pedido.usuario.clave = null;
            detallePedido.producto.propietario.clave = null;
            detallePedido.pedido.fecha_orden = await this.utilsService.formatDate(detallePedido.pedido.fecha_orden);
        }
        
        return detallePedidosPropietarioProducto;
    }

    async ConfirmarEnvio(id: string, token: string) {
        const headers = { Authorization: `Bearer ${token}` };
        const pedido = await this.utilsService.SendGet<Pedido>(process.env.AUREX_MID_AUREX_CRUD_URL, `pedido/${id}`, headers);
        const todosEstadoPedido = await this.utilsService.SendGet<EstadoPedido[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `estado_pedido`, headers);
        const estadoPedidoEnviado = todosEstadoPedido.find(estadoPedido => (estadoPedido.nombre == "Enviado") && estadoPedido.activo);
        const todosHistorialTransaccion = await this.utilsService.SendGet<HistorialTransaccion[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `historial_transaccion`, headers);
        const ventaHistorialTransaccion = todosHistorialTransaccion.find(historialTransaccion => (historialTransaccion.tipo == "Venta") && (historialTransaccion.pedido.id == Number(id)));

        if (pedido) {
            if (estadoPedidoEnviado) {
                let dataPedido = pedido;
                dataPedido.estado_pedido = estadoPedidoEnviado;

                const pedidoActualizado = await this.utilsService.SendPut<Pedido, Pedido>(process.env.AUREX_MID_AUREX_CRUD_URL, `pedido/${id}`, dataPedido, headers);

                if (pedidoActualizado) {
                    let dataHistorialTransaccion = ventaHistorialTransaccion;
                    dataHistorialTransaccion.confirmacion = true;

                    const historialTransaccionActualizado = await this.utilsService.SendPut<HistorialTransaccion, HistorialTransaccion>(process.env.AUREX_MID_AUREX_CRUD_URL, `historial_transaccion/${ventaHistorialTransaccion.id}`, dataHistorialTransaccion, headers);

                    if (!historialTransaccionActualizado) {
                        throw new Error("Ocurrió un error al intentar actualizar el historial de transacción de tipo venta.");
                    }

                    await this.emailService.EnviarEmail(pedido.usuario.correo, "PEDIDO ENVIADO", null);
                } else {
                    throw new Error("Ocurrió un error al intentar actualizar el pedido.");
                }
            } else {
                throw new Error("No se pudo obtener el estado Enviado de los estados de pedido.");
            }
        } else {
            throw new Error("No se pudo obtener el pedido.");
        }
    }

    async HistorialCompra(id: string, token: string) {
        const headers = { Authorization: `Bearer ${token}` };
        const todosDetallePedido = await this.utilsService.SendGet<DetallePedido[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `detalle_pedido`, headers);
        const detallePedidoCompras = todosDetallePedido.filter(detallePedido => detallePedido.pedido.usuario.id == Number(id))

        for (const detallePedido of detallePedidoCompras) {
            detallePedido.pedido.usuario.clave = null;
            detallePedido.producto.propietario.clave = null;
            detallePedido.pedido.fecha_orden = await this.utilsService.formatDate(detallePedido.pedido.fecha_orden);
        }

        return detallePedidoCompras;
    }

    async ConfirmarEntrega(idPedido: string, idVendedor: string, token: string) {
        const headers = { Authorization: `Bearer ${token}` };
        const pedido = await this.utilsService.SendGet<Pedido>(process.env.AUREX_MID_AUREX_CRUD_URL, `pedido/${idPedido}`, headers);
        const todosEstadoPedido = await this.utilsService.SendGet<EstadoPedido[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `estado_pedido`, headers);
        const estadoPedidoEntregado = todosEstadoPedido.find(estadoPedido => (estadoPedido.nombre == "Entregado") && estadoPedido.activo);
        const todosHistorialTransaccion = await this.utilsService.SendGet<HistorialTransaccion[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `historial_transaccion`, headers);
        const compraHistorialTransaccion = todosHistorialTransaccion.find(historialTransaccion => (historialTransaccion.tipo == "Compra") && (historialTransaccion.pedido.id == Number(idPedido)));
        const todosCreditoBloqueado = await this.utilsService.SendGet<CreditoBloqueado[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `credito_bloqueado`, headers);
        const pedidoCreditoBloqueado = todosCreditoBloqueado.find(creditoBloqueado => (creditoBloqueado.pedido.id == Number(idPedido)));
        const todosCredito = await this.utilsService.SendGet<Credito[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `credito`, headers);
        const creditoVendedor = todosCredito.find(credito => (credito.usuario.id == Number(idVendedor)) && (credito.activo));
        const todosDetallePedido = await this.utilsService.SendGet<DetallePedido[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `detalle_pedido`, headers);
        const detallePedido = todosDetallePedido.find(detallePedido => (detallePedido.pedido.id == Number(idPedido)));
        const productoComprado = await this.utilsService.SendGet<Producto>(process.env.AUREX_MID_AUREX_CRUD_URL, `producto/${detallePedido.producto.id}`, headers);

        if (pedido) {
            if (estadoPedidoEntregado) {
                let dataPedido = pedido;
                dataPedido.estado_pedido = estadoPedidoEntregado;

                const pedidoActualizado = await this.utilsService.SendPut<Pedido, Pedido>(process.env.AUREX_MID_AUREX_CRUD_URL, `pedido/${idPedido}`, dataPedido, headers);

                if (pedidoActualizado) {
                    let dataHistorialTransaccion = compraHistorialTransaccion;
                    dataHistorialTransaccion.confirmacion = true;

                    const historialTransaccionActualizado = await this.utilsService.SendPut<HistorialTransaccion, HistorialTransaccion>(process.env.AUREX_MID_AUREX_CRUD_URL, `historial_transaccion/${compraHistorialTransaccion.id}`, dataHistorialTransaccion, headers);

                    if (historialTransaccionActualizado) {
                        let dataCreditoVendedor = creditoVendedor;
                        dataCreditoVendedor.monto = Number(dataCreditoVendedor.monto) + Number(pedidoCreditoBloqueado.monto_bloqueado);

                        const creditoVendedorActualizado = await this.utilsService.SendPut<Credito, Credito>(process.env.AUREX_MID_AUREX_CRUD_URL, `credito/${creditoVendedor.id}`, dataCreditoVendedor, headers);

                        if (creditoVendedorActualizado) {
                            let datapedidoCreditoBloqueado = pedidoCreditoBloqueado;
                            datapedidoCreditoBloqueado.activo = false;

                            const creditoBloqueadoActualizado = await this.utilsService.SendPut<CreditoBloqueado, CreditoBloqueado>(process.env.AUREX_MID_AUREX_CRUD_URL, `credito_bloqueado/${pedidoCreditoBloqueado.id}`, datapedidoCreditoBloqueado, headers);

                            if (creditoBloqueadoActualizado) {
                                let dataProductoComprado = productoComprado;
                                dataProductoComprado.existencias = Number(dataProductoComprado.existencias) - Number(detallePedido.cantidad);

                                const productoCompradoActualizado = await this.utilsService.SendPut<Producto, Producto>(process.env.AUREX_MID_AUREX_CRUD_URL, `producto/${productoComprado.id}`, dataProductoComprado, headers);

                                if (!productoCompradoActualizado) {
                                    throw new Error("No se pudo actualizar el producto.");
                                }

                                const dataEmail = {
                                    "nombre_producto": productoComprado.nombre,
                                    "direccion": pedido.usuario.direccion,
                                    "monto_total": pedido.monto_total
                                }
                                await this.emailService.EnviarEmail(productoComprado.propietario.correo, "PEDIDO ENTREGADO", dataEmail);
                            } else {
                                throw new Error("No se pudo actualizar el credito bloqueado.");
                            }
                        } else {
                            throw new Error("No se pudo actualizar el credito del Vendedor.");
                        }
                    } else {
                        throw new Error("No se pudo actualizar el historial de transacción.");
                    }
                } else {
                    throw new Error("No se pudo actualizar el pedido.");
                }
            } else {
                throw new Error("No se pudo obtener el estado Entregado de los estados de pedido.");
            }
        } else {
            throw new Error("No se pudo obtener el pedido.");
        }
    }
}
