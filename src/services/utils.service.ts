import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UtilsService {
    constructor(private readonly httpService: HttpService) { }

    async SendGet<T>(endpoint: string, route: string, headers?: any): Promise<T> {
        const url = `${endpoint}/${route}`;

        try {
            const response = await lastValueFrom(this.httpService.get<{ Success: boolean, Data: T }>(url, { headers }));
            
            if (response.data.Success) {
                return response.data.Data;
            } else {
                throw new Error('The server response indicated a failure.')
            }
        } catch (error) {
            throw new Error(`GET request failed.`);
        }
    }

    async SendPost<T, U>(endpoint: string, route: string, body: U, headers?: any): Promise<T> {
        const url = `${endpoint}/${route}`;

        try {
            const response = await lastValueFrom(this.httpService.post<{ Success: boolean; Data: T }>(url, body, { headers }));

            if(response.data.Success) {
                return response.data.Data;
            } else {
                throw new Error('The server response indicated a failure.')
            }
        } catch (error) {
            throw new Error(`POST request failed.`);
        }
    }

    async SendPut<T, U>(endpoint: string, route: string, body: U, headers?: any): Promise<T> {
        const url = `${endpoint}/${route}`;

        try {
            const response = await lastValueFrom(this.httpService.put<{ Success: boolean; Data: T }>(url, body, { headers }));

            if(response.data.Success) {
                return response.data.Data;
            } else {
                throw new Error('The server response indicated a failure.')
            }
        } catch (error) {
            throw new Error(`PUT request failed.`);
        }
    }

    async SendDelete<T>(endpoint: string, route: string, headers?: any): Promise<T> {
        const url = `${endpoint}/${route}`;

        try {
            const response = await lastValueFrom(this.httpService.delete<{ Success: boolean, Data: T }>(url, { headers }));
            if (response.data.Success) {
                return response.data.Data;
            } else {
                throw new Error('The server response indicated a failure.')
            }
        } catch (error) {
            throw new Error(`DELETE request failed.`);
        }
    }
}