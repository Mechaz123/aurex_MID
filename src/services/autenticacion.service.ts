import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AutenticacionService {
    constructor(private jwtService: JwtService) {}
    
    async generarToken(userId: string) {
        const payload = { userId };
        return this.jwtService.sign(payload);
    }

    async verificarToken(token: string) {
        try {
            return this.jwtService.verifyAsync(token);
        } catch (error) {
            throw new Error('Token Invalido.');
        }
    }
}
