# AUREX_MID
:heavy_check_mark: Check: Repositorio api MID para AUREX.

## Especificaciones Tecnicas

### Tecnologías implementadas

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="Center">Nest.js</p>

### Variables de entorno

```bash
# API parametros
AUREX_MID_AUREX_CRUD_URL=[URL de AUREX_CRUD]
AUREX_MID_HTTP_PORT=[Puerto expuesto para el API]
SECRET_KEY=[Clave secreta para los Tokens]
```

## Configuración del proyecto

```bash
$ npm install
```

## Compilación y ejecución del proyecto

```bash
# Pruebas
$ npm run start

# Desarrollo
$ npm run start:dev

# Modo producción
$ npm 
```

## Despliegue

Actualmente el sistema se encuentra conectado con el entorno de Azure, de tal forma que cualquier cambio que se suba en la rama de develop, este se sincronizará automáticamente con los archivos en Azure, de manera que en Github Actions, podremos ver el proceso de despliegue de dichos cambios.

## Recursos

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.