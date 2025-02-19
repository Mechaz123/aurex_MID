import { Injectable } from '@nestjs/common';
import { Category } from 'src/interfaces/category.interface';
import { UtilsService } from './utils.service';

@Injectable()
export class CategoryService {
    constructor(
        private readonly utilsService: UtilsService
    ) { }

    async ParentCategories(token: string): Promise<Category[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const allCategory = await this.utilsService.SendGet<Category[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "category", headers);
        const parentcategories = allCategory.filter(parentCategory => (parentCategory.parentCategory == null) && parentCategory.active).sort((a, b) => a.name.localeCompare(b.name));
        return parentcategories;
    }

    async SecondaryCategories(token: string): Promise<Category[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const allCategory = await this.utilsService.SendGet<Category[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "category", headers);
        const secondarycategories = allCategory.filter(parentCategory => (parentCategory.parentCategory != null) && parentCategory.active).sort((a, b) => a.name.localeCompare(b.name));
        return secondarycategories;
    }
}
