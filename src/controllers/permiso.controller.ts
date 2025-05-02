import { Controller, Get, Headers, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AutenticacionGuard } from 'src/guards/autenticacion.guard';
import { PermisoService } from 'src/services/permiso.service';

@Controller('permiso')
export class PermisoController {
    constructor(
        private readonly permisoService: PermisoService,
    ) { }

    @UseGuards(AutenticacionGuard)
    @Get("/activos")
    async getPermisosActivos(@Res() response: Response, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const permisosActivos = await this.permisoService.PermisosActivo(token);
            response.status(HttpStatus.OK);
            response.json({ Data: permisosActivos, Message: 'Permisos activos cargados exitosamente.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false })
        }
    }
}
