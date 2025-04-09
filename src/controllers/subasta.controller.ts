import { Body, Controller, Get, Headers, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AutenticacionGuard } from 'src/guards/autenticacion.guard';
import { SubastaService } from 'src/services/subasta.service';

@Controller('subasta')
export class SubastaController {
    constructor(
        private readonly subastaService: SubastaService
    ) { }

    @UseGuards(AutenticacionGuard)
    @Get("/propietario/:id")
    async getSubastasPropietario(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const subastas = await this.subastaService.SubastasPropietario(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: subastas, Message: 'Las subastas asociadas al propietario del producto, se han cargado exitosamente.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Get("/comprobar")
    async getComprobar(@Res() response: Response, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            await this.subastaService.Comprobar(token);
            response.status(HttpStatus.OK);
            response.json({ Data: true, Message: 'Se ha verificado las subastas.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: false, Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Get("/activas")
    async getSubastasActivas(@Res() response: Response, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const dataSubasta = await this.subastaService.SubastasActivas(token);
            response.status(HttpStatus.OK);
            response.json({ Data: dataSubasta, Message: 'Se han consultado las subastas activas.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Post("/registrar_puja")
    async postRegistrarPuja(@Res() response: Response, @Body() body: Partial<any>, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            await this.subastaService.RegistrarPuja(body, token);
            response.status(HttpStatus.OK);
            response.json({ Data: true, Message: 'La puja ha sido registrada exitosamente.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: false, Message: `El body contiene errores u ocurrió un error interno en el servidor(${error}).`, Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }
}
