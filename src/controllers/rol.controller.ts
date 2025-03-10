import { Controller, Get, Headers, HttpStatus, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AutenticacionGuard } from 'src/guards/autenticacion.guard';
import { RolService } from 'src/services/rol.service';

@Controller('rol')
export class RolController {
    constructor(
        private readonly rolService: RolService,
    ) { }

    @UseGuards(AutenticacionGuard)
    @Get("/:id/permisos")
    async getRolPermisos(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const dataRolPermisos = await this.rolService.getRolPermisos(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: dataRolPermisos, Message: 'Los permisos del rol han cargado exitosamente.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Get("/activos")
    async getRolesActivos(@Res() response: Response, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const dataRolesActivos = await this.rolService.getRolesActivos(token);
            response.status(HttpStatus.OK);
            response.json({ Data: dataRolesActivos, Message: 'Los roles activos han cargado exitosamente.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }
}
