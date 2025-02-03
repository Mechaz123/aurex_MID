import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { UserStatus } from 'src/interfaces/user_status.interface';
import { User } from 'src/interfaces/user.interface';
import { error } from 'console';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class UserService {
    constructor(
        private readonly utilsService: UtilsService,
        private authService: AuthenticationService
    ) { }

    async UsersActive(): Promise<User[]> {
        const allUsersStatus = await this.utilsService.SendGet<UserStatus[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "user_status");
        const allUsers = await this.utilsService.SendGet<User[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "user");
        const userStatus = allUsersStatus.find(userStatus => userStatus.name == "Active" && userStatus.active);

        if (userStatus != undefined) {
            const usersActive = allUsers.filter(user => user.user_status.id == userStatus.id);
            return usersActive;
        } else {
            return new error;
        }
    }

    async UserAuthentication(body: any): Promise<any> {
        const allUsersStatus = await this.utilsService.SendGet<UserStatus[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "user_status");
        const userStatus = allUsersStatus.find(userStatus => userStatus.name == "Active" && userStatus.active);
        const userData = await this.utilsService.SendGet<User>(process.env.AUREX_MID_AUREX_CRUD_URL, `user/${body.id}`);

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
}