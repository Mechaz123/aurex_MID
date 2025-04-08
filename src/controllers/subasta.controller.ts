import { Controller, Get, Headers, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AutenticacionGuard } from 'src/guards/autenticacion.guard';
import { SubastaService } from 'src/services/subasta.service';

@Controller('subasta')
export class SubastaController {
    constructor(
        private readonly subastaService: SubastaService
    ) { }

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
}
