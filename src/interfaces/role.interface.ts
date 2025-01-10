export interface Role {
    id: number;
    name: string;
    description?: string;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}