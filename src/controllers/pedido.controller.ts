import { Body, Controller, Get, Headers, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AutenticacionGuard } from 'src/guards/autenticacion.guard';
import { PedidoService } from 'src/services/pedido.service';

@Controller('pedido')
export class PedidoController {
    constructor(
        private readonly pedidoService: PedidoService,
    ) { }

    @UseGuards(AutenticacionGuard)
    @Get("/productos_pedido_propietario/:id")
    async getProductosPedidoPropietario(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const productosPedidoPropietario = await this.pedidoService.ProductosPedidoPropietario(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: productosPedidoPropietario, Message: 'Los pedidos asociados al propietario del producto, se han cargado exitosamente.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Get("/historial_compra/:id")
    async getHistorialCompra(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const historialCompra = await this.pedidoService.HistorialCompra(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: historialCompra, Message: 'Los pedidos asociados al comprador, se han cargado exitosamente.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Post("/crear_compra")
    async postCrearCompra(@Res() response: Response, @Body() body: Partial<any>, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            await this.pedidoService.CrearCompra(body, token);
            response.status(HttpStatus.CREATED);
            response.json({ Data: true, Message: 'La compra fue creada.', Status: HttpStatus.CREATED, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: false, Message: `El body contiene errores u ocurrió un error interno en el servidor(${error}).`, Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
        return response;
    }

    @UseGuards(AutenticacionGuard)
    @Post("/confirmar_envio")
    async postConfirmarEnvio(@Res() response: Response, @Body() body: Partial<any>, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            await this.pedidoService.ConfirmarEnvio(body.idPedido, token);
            response.status(HttpStatus.OK);
            response.json({ Data: true, Message: 'El pedido ha sido confirmado.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: false, Message: `El body contiene errores u ocurrió un error interno en el servidor(${error}).`, Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Post("/confirmar_entrega")
    async postConfirmarEntrega(@Res() response: Response, @Body() body: Partial<any>, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            await this.pedidoService.ConfirmarEntrega(body.idPedido, body.idVendedor, token);
            response.status(HttpStatus.OK);
            response.json({ Data: true, Message: 'El pedido ha sido confirmado.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: false, Message: `El body contiene errores u ocurrió un error interno en el servidor(${error}).`, Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }
}
