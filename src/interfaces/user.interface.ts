import { UserStatus } from "./user_status.interface";

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    address: string;
    phone: string;
    country: string;
    image_url: string;
    created_at: Date;
    updated_at: Date;
    user_status: UserStatus;
}