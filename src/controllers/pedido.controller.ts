import { Body, Controller, Headers, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AutenticacionGuard } from 'src/guards/autenticacion.guard';
import { PedidoService } from 'src/services/pedido.service';

@Controller('pedido')
export class PedidoController {
    constructor(
        private readonly pedidoService: PedidoService,
    ) { }

    @UseGuards(AutenticacionGuard)
    @Post("/crear_compra")
    async postCrearCompra(@Res() response: Response, @Body() body: Partial<any>, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            await this.pedidoService.CrearCompra(body, token);
            response.status(HttpStatus.CREATED);
            response.json({ Data: true, Message: 'La compra fue creada.', Status: HttpStatus.CREATED, Success: true});
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({Data: false, Message: `El body contiene errores u ocurrió un error interno en el servidor(${error}).`, Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false});
        }
        return response;
    }
}
