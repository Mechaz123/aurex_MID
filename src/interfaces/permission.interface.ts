export interface Permission {
    id: number;
    name: string;
    description?: string;
    resource: string;
    action: string;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}