import { Controller, Get, Headers, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AutenticacionGuard } from 'src/guards/autenticacion.guard';
import { CategoriaService } from 'src/services/categoria.service';

@Controller('categoria')
export class CategoriaController {
    constructor(
        private readonly categoriaService: CategoriaService,
    ) { }

    @UseGuards(AutenticacionGuard)
    @Get("/categorias_principales")
    async getCategoriasPrincipales(@Res() response: Response, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const categorias_principales = await this.categoriaService.CategoriasPrincipales(token);

            response.status(HttpStatus.OK);
            response.json({ Data: categorias_principales, Message: 'Categorias principales cargadas exitosamente.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Get("/categorias_secundarias")
    async getCategoriasSecundarias(@Res() response: Response, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const categorias_secundarias = await this.categoriaService.CategoriasSecundarias(token);

            response.status(HttpStatus.OK);
            response.json({ Data: categorias_secundarias, Message: 'Categorias secundarias cargadas exitosamente.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }
}
