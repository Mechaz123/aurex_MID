import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { UserStatus } from 'src/interfaces/user_status.interface';
import { User } from 'src/interfaces/user.interface';
import { error } from 'console';
import { AuthenticationService } from './authentication.service';
import { UserRole } from 'src/interfaces/user_role.interface';
import { RolePermission } from 'src/interfaces/role_permission.interface';

@Injectable()
export class UserService {
    constructor(
        private readonly utilsService: UtilsService,
        private authService: AuthenticationService
    ) { }

    async UsersActive(token: string): Promise<User[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const allUsersStatus = await this.utilsService.SendGet<UserStatus[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "user_status", headers);
        const allUsers = await this.utilsService.SendGet<User[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "user", headers);
        const userStatus = allUsersStatus.find(userStatus => userStatus.name == "Active" && userStatus.active);

        if (userStatus != undefined) {
            const usersActive = allUsers.filter(user => user.user_status.id == userStatus.id);
            return usersActive;
        } else {
            return new error;
        }
    }

    async UserAuthentication(body: any): Promise<any> {
        const allUsersStatus = await this.utilsService.SendGet<UserStatus[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "authentication/user_status");
        const userStatus = allUsersStatus.find(userStatus => userStatus.name == "Active" && userStatus.active);
        const userData = await this.utilsService.SendGet<User>(process.env.AUREX_MID_AUREX_CRUD_URL, `authentication/user/${body.id}`);

        if (userStatus != undefined && userData != undefined) {
            if ((body.username === userData.username) && userData.user_status.id === userStatus.id && (body.hash == userData.password)) {
                const token = await this.authService.generateToken(body.id);
                return { token };
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    async MenuOptions(id: string, token: string) {
        let dataRolePermission = [];
        let options = [];
        const headers = { Authorization: `Bearer ${token}`};
        const allUsersRole = await this.utilsService.SendGet<UserRole[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "user_role", headers);
        const allRolePermission = await this.utilsService.SendGet<RolePermission[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "role_permission", headers);
        const userRole = allUsersRole.filter(userRole => userRole.user.id == Number(id) && userRole.active);
        for (const dataUserRole of userRole) {
            let rolePermission = allRolePermission.filter(rolePermission => (rolePermission.active) && (rolePermission.role.id == dataUserRole.role.id));
            dataRolePermission.push(rolePermission);
        }

        for (const RolePermission of dataRolePermission) {
            for(const data of RolePermission) {
                options.push(data.permission.resource);
            }
        }
        
        return options;
    }
}