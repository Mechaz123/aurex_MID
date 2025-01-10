export interface Category {
    id: number;
    name: string;
    description?: string;
    parentCategory: Category;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}