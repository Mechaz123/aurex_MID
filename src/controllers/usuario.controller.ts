import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards, Headers, Param } from '@nestjs/common';
import { Response } from 'express';
import { AutenticacionGuard } from 'src/guards/autenticacion.guard';
import { Usuario } from 'src/interfaces/usuario.interface';
import { AutenticacionService } from 'src/services/autenticacion.service';
import { UsuarioService } from 'src/services/usuario.service';

@Controller('usuario')
export class UsuarioController {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly authService: AutenticacionService,
    ) { }

    @Post("/autenticacion")
    async postUsuarioAutenticacion(@Res() response: Response, @Body() body: Partial<Usuario>) {
        try {
            const usuarioAutenticacion = await this.usuarioService.AutenticacionUsuario(body);
            response.status(HttpStatus.OK);
            response.json({ Data: usuarioAutenticacion, Message: 'El usuario fue autenticado.', Status: HttpStatus.OK, Success: true});
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({Data: {}, Message: 'El body contiene errores, el usuario no pudo ser autenticado.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false});
        }
        return response;
    }

    @Get("/verificar_autenticacion")
    async verificarUsuarioAutenticacion(@Res() response: Response, @Headers('Authorization') authHeader: string) {
        try {
          if(authHeader) {
            const token = authHeader.split(' ')[1];
            await this.authService.verificarToken(token);

            response.status(HttpStatus.OK);
            response.json({ Data: {valido: true}, Message: 'Autenticacion correctamente verificada.', Status: HttpStatus.OK, Success: true });
          } else {
            response.status(HttpStatus.UNAUTHORIZED);
            response.json({ Data: {valido: false}, Message: 'No se encontro el token.', Status: HttpStatus.UNAUTHORIZED, Success: false });
          }
        } catch (error) {
            response.status(HttpStatus.UNAUTHORIZED);
            response.json({ Data: {valido: false}, Message: 'Usuario no autorizado.', Status: HttpStatus.UNAUTHORIZED, Success: false })
        }
        return response;
    }

    @UseGuards(AutenticacionGuard)
    @Get("/activos")
    async getUsuariosActivos(@Res() response: Response, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const usuariosActivos = await this.usuarioService.UsuariosActivos(token);
            response.status(HttpStatus.OK);
            response.json({ Data: usuariosActivos, Message: 'Usuarios activos cargados exitosamente.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false })
        }
        return response;
    }

    @UseGuards(AutenticacionGuard)
    @Get("/:id/menu_opciones")
    async getMenuOpciones(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const opciones = await this.usuarioService.MenuOpciones(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: opciones, Message: 'Menu opciones cargadas exitosamente.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }

    @UseGuards(AutenticacionGuard)
    @Get("/:id/roles")
    async getUsuarioRoles(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const usuarioRoles = await this.usuarioService.UsuarioRoles(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: usuarioRoles, Message: 'Los roles del usuario han sido cargados exitosamente.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Error interno del servidor.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }
}