import { Controller, Get, Headers, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { PermissionService } from 'src/services/permission.service';

@Controller('permission')
export class PermissionController {
    constructor(
        private readonly permissionService: PermissionService,
    ) { }

    @UseGuards(AuthenticationGuard)
    @Get("/active")
    async getActivePermission(@Res() response: Response, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const permissionActive = await this.permissionService.PermissionActive(token);
            response.status(HttpStatus.OK);
            response.json({ Data: permissionActive, Message: 'Permissions active loaded successfully.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Internal server error.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false })
        }
    }
}
