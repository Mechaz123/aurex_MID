import { Controller, Get, Headers, HttpStatus, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { RoleService } from 'src/services/role.service';

@Controller('role')
export class RoleController {
    constructor(
        private readonly roleService: RoleService,
    ) { }

    @UseGuards(AuthenticationGuard)
    @Get("/:id/permission")
    async getRolePermission(@Res() response: Response, @Param('id') id: string, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const dataRolePermission = await this.roleService.getRolePermission(id, token);
            response.status(HttpStatus.OK);
            response.json({ Data: dataRolePermission, Message: 'Role Permissions loaded successfully.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Internal server error.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false });
        }
    }
}
