import { Body, Controller, Get, Headers, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AutenticacionGuard } from 'src/guards/autenticacion.guard';
import { IntercambioService } from 'src/services/intercambio.service';

@Controller('intercambio')
export class IntercambioController {
    constructor(
        private readonly intercambioService: IntercambioService
    ) { }

    @UseGuards(AutenticacionGuard)
    @Get("/verificar_requisitos/:id")
    async getVerificarRequisitos(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const verificacionRequisitos = await this.intercambioService.VerificarRequisitos(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: verificacionRequisitos, Message: 'El usuario fue verificado para intercambiar.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: null, Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Get("/historial/:id")
    async getHistorialIntercambio(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const dataHistorialIntercambio = await this.intercambioService.HistorialIntercambio(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: dataHistorialIntercambio, Message: 'El historial de intercambio fue cargado exitosamente.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: null, Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Get("/rechazar_solicitud/:id")
    async getRechazarSolicitud(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            await this.intercambioService.RechazarSolicitud(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: true, Message: 'La solicitud de intercambio ha sido rechazada.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: false, Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Get("/aceptar_solicitud/:id")
    async getAceptarSolicitud(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            await this.intercambioService.AceptarSolicitud(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: true, Message: 'La solicitud de intercambio ha sido aceptada.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: false, Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Post("/crear_solicitud")
    async postCrearSolicitud(@Res() response: Response, @Body() body: Partial<any>, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            await this.intercambioService.CrearSolicitud(body, token);
            response.status(HttpStatus.CREATED);
            response.json({ Data: true, Message: 'La solicitud de intercambio fue creada.', Status: HttpStatus.CREATED, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: false, Message: `El body contiene errores u ocurrió un error interno en el servidor(${error}).`, Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }
}
