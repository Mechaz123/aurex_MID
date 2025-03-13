
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUREX_MID_GMAIL_USER,
                pass: process.env.AUREX_MID_GMAIL_PASSWORD,
            },
        });
    }

    private loadHtmlTemplate(templateName: string, variables: Record<string, string>): string {
        try {
            const templatePaths = [
                path.join(__dirname, './../../src/templates', `${templateName}.html`), // RUTA PARA DESARROLLO
                path.join(__dirname, '../templates', `${templateName}.html`) // RUTA PARA PRODUCCIÓN
            ];

            let htmlContent = '';
            
            for (const templatePath of templatePaths) {
                if (fs.existsSync(templatePath)) {
                    htmlContent = fs.readFileSync(templatePath, 'utf8');
                    break;
                }
            }

            htmlContent = htmlContent.replace(/{{(.*?)}}/g, (_, key) => variables[key.trim()] || '');
            return htmlContent;
        } catch (error) {
            console.log("Error al cargar el template: ", error);
        }
    }

    async EnviarEmail(to: string, subject: string, content: any) {
        let html: any;
        
        if(subject == "TERMINOS Y CONDICIONES DE AUREX"){
            html = this.loadHtmlTemplate("terminos_y_condiciones", content);
        } else if (subject == "USUARIO REGISTRADO EN AUREX") {
            html = this.loadHtmlTemplate("usuario_registrado", content);
        } else if (subject == "INGRESO DE DINERO A CUENTA") {
            html = this.loadHtmlTemplate("deposito_dinero", content);
        }

        const mailOptions = {
            from: process.env.AUREX_MID_GMAIL_USER,
            to,
            subject,
            html,
        };

        try {
            const result = await this.transporter.sendMail(mailOptions);
            console.log('Correo enviado:', result);
        } catch (error) {
            console.error('Error enviando correo:', error);
            throw error;
        }
    }
}
