import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/interfaces/user.interface';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get("/active")
    async getUsersActive(@Res() response: Response) {
        try {
            const usersActive = await this.userService.UsersActive();
            response.status(HttpStatus.OK);
            response.json({ Data: usersActive, Message: 'Users active loaded successfully.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Internal server error.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false })
        }
        return response;
    }

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
}