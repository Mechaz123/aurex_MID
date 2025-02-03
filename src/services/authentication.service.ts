import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
    constructor(private jwtService: JwtService) {}
    
    async generateToken(userId: string) {
        const payload = { userId };
        return this.jwtService.sign(payload);
    }

    async verifyToken(token: string) {
        try {
            return this.jwtService.verifyAsync(token);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}
