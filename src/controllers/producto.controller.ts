import { Controller, Get, Headers, HttpStatus, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AutenticacionGuard } from 'src/guards/autenticacion.guard';
import { ProductoService } from 'src/services/producto.service';

@Controller('producto')
export class ProductoController {
    constructor(
        private readonly productoService: ProductoService,
    ) { }

    @UseGuards(AutenticacionGuard)
    @Get("/venta")
    async getProductosVenta(@Res() response: Response, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const dataProductosVenta = await this.productoService.getProductosVenta(token);
            response.status(HttpStatus.OK);
            response.json({ Data: dataProductosVenta, Message: 'Los productos en venta han sido cargados exitosamente.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Get("/venta/propietario/:id")
    async getProductosVentaPropietario(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const dataProductosPropietario = await this.productoService.getProductosVentaPropietario(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: dataProductosPropietario, Message: 'Los productos en venta del propietario fueron cargados.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Get("/intercambio/propietario/:id")
    async getProductosIntercambioPropietario(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const dataProductosPropietario = await this.productoService.getProductosIntercambioPropietario(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: dataProductosPropietario, Message: 'Los productos para intercambio del propietario fueron cargados.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Get("/subasta/propietario/:id")
    async getProductosSubastaPropietario(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const dataProductosPropietario = await this.productoService.getProductosSubastaPropietario(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: dataProductosPropietario, Message: 'Los productos para intercambio del propietario fueron cargados.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Get("/donacion/propietario/:id")
    async getProductosDonacionPropietario(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const dataProductosPropietario = await this.productoService.getProductosDonacionPropietario(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: dataProductosPropietario, Message: 'Los productos para intercambio del propietario fueron cargados.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }
}
