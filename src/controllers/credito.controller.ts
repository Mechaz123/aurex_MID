import { Body, Controller, Get, Headers, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AutenticacionGuard } from 'src/guards/autenticacion.guard';
import { CreditoService } from 'src/services/credito.service';

@Controller('credito')
export class CreditoController {
    constructor(
        private readonly creditoService: CreditoService,
    ) { }

    @UseGuards(AutenticacionGuard)
    @Get("/verificar_roles/:id")
    async getVerificarRolesPropietario(@Res() response: Response, @Param('id') id :string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const verificacionRolesPropietario = await this.creditoService.VerificarRolesPropietario(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: verificacionRolesPropietario, Message: 'El usuario fue verificado.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: null, Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Get("/verificar_registro/:id")
    async getVerificarRegistro(@Res() response: Response,@Param('id') id :string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const verificacionRegistro = await this.creditoService.VerificarRegistro(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: verificacionRegistro, Message: 'El registro en credito del usuario fue verificado.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: null, Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Get("/consultar_monto/:id")
    async getConsultarMonto(@Res() response: Response,@Param('id') id :string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const credito = await this.creditoService.ConsultarMonto(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: credito, Message: 'El monto del usuario ha sido consultado.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: null, Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }
}
