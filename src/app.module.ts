import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UtilsService } from './services/utils.service';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioController } from './controllers/usuario.controller';
import { CategoriaController } from './controllers/categoria.controller';
import { RolController } from './controllers/rol.controller';
import { PermisoController } from './controllers/permiso.controller';
import { AutenticacionService } from './services/autenticacion.service';
import { UsuarioService } from './services/usuario.service';
import { CategoriaService } from './services/categoria.service';
import { RolService } from './services/rol.service';
import { PermisoService } from './services/permiso.service';
import { ProductoController } from './controllers/producto.controller';
import { ProductoService } from './services/producto.service';
import { EmailController } from './controllers/email.controller';
import { EmailService } from './services/email.service';
import { CreditoController } from './controllers/credito.controller';
import { CreditoService } from './services/credito.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1h' }
    }),
  ],
  controllers: [
    UsuarioController,
    CategoriaController,
    RolController,
    PermisoController,
    ProductoController,
    EmailController,
    CreditoController
  ],
  providers: [
    AutenticacionService,
    UtilsService,
    UsuarioService,
    CategoriaService,
    RolService,
    PermisoService,
    ProductoService,
    EmailService,
    CreditoService
  ],
})

export class AppModule { }