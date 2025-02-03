import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/services/authentication.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly authService: AuthenticationService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided.');
    }
    
    return this.authService.verifyToken(token)
    .then(() => true)
    .catch(() => {
      throw new UnauthorizedException('Invalid token.');
    });
  }
}
