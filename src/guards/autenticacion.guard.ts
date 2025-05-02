import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AutenticacionService } from 'src/services/autenticacion.service';

@Injectable()
export class AutenticacionGuard implements CanActivate {
  constructor(private readonly authService: AutenticacionService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token no obtenido.');
    }
    
    return this.authService.verificarToken(token)
    .then(() => true)
    .catch(() => {
      throw new UnauthorizedException('Token invalido.');
    });
  }
}
