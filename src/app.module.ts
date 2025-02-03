import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UtilsService } from './services/utils.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './services/authentication.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1h'}
    }),
  ],
  controllers: [
    UserController,
  ],
  providers: [
    AuthenticationService,
    UtilsService,
    UserService,
  ],
})

export class AppModule {}