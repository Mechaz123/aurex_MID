import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AutenticacionGuard } from 'src/guards/autenticacion.guard';
import { EmailService } from 'src/services/email.service';

@Controller('email')
export class EmailController {
    constructor(
        private readonly emailService: EmailService,
    ) { }

    @UseGuards(AutenticacionGuard)
    @Post("/enviar")
    async postEnviarEmail(@Res() response: Response, @Body() body: { to: string, subject: string, content: any }) {
        try {
            await this.emailService.EnviarEmail(body.to, body.subject, body.content);
            response.status(HttpStatus.OK);
            response.json({ Data: true, Message: 'El correo ha sido enviado.', Status: HttpStatus.OK, Success: true});
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({Data: false, Message: 'El body contiene errores, no se pudo enviar el correo.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false});
        }
    }
}
