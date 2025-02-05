import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards, Headers, Param } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { User } from 'src/interfaces/user.interface';
import { AuthenticationService } from 'src/services/authentication.service';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthenticationService,
    ) { }

    @Post("/authentication")
    async postUserAuthentication(@Res() response: Response, @Body() body: Partial<User>) {
        try {
            const UserAuthentication = await this.userService.UserAuthentication(body);
            response.status(HttpStatus.OK);
            response.json({ Data: UserAuthentication, Message: 'The user has been authenticated.', Status: HttpStatus.OK, Success: true});
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({Data: {}, Message: 'The body contains errors, the user cannot be authenticated.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false});
        }
        return response;
    }

    @Get("/verify_authentication")
    async verifyUserAuthentication(@Res() response: Response, @Headers('Authorization') authHeader: string) {
        try {
          if(authHeader) {
            const token = authHeader.split(' ')[1];
            await this.authService.verifyToken(token);

            response.status(HttpStatus.OK);
            response.json({ Data: {valid: true}, Message: 'Authentication successfully verified.', Status: HttpStatus.OK, Success: true });
          } else {
            response.status(HttpStatus.UNAUTHORIZED);
            response.json({ Data: {valid: false}, Message: 'No token provided.', Status: HttpStatus.UNAUTHORIZED, Success: false });
          }
        } catch (error) {
            response.status(HttpStatus.UNAUTHORIZED);
            response.json({ Data: {valid: false}, Message: 'Unauthorized user.', Status: HttpStatus.UNAUTHORIZED, Success: false })
        }
        return response;
    }

    @UseGuards(AuthenticationGuard)
    @Get("/active")
    async getActiveUsers(@Res() response: Response, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const usersActive = await this.userService.UsersActive(token);
            response.status(HttpStatus.OK);
            response.json({ Data: usersActive, Message: 'Users active loaded successfully.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Internal server error.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false })
        }
        return response;
    }

    @UseGuards(AuthenticationGuard)
    @Get("/:id/menu_options")
    async getMenuOptions(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const options = await this.userService.MenuOptions(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: options, Message: 'Menu options loaded successfully.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Internal server error.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }
}