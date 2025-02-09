import { Controller, Get, Headers, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { CategoryService } from 'src/services/category.service';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) { }

    @UseGuards(AuthenticationGuard)
    @Get("/parent_categories")
    async getParentCategories(@Res() response: Response, @Headers('Authorization') authHeader: string) {
        try {
            const token = authHeader.split(' ')[1];
            const parent_categories = await this.categoryService.ParentCategories(token);

            response.status(HttpStatus.OK);
            response.json({ Data: parent_categories, Message: 'Parent categories loaded successfully.', Status: HttpStatus.OK, Success: true });
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.json({ Data: [], Message: 'Internal server error.', Status: HttpStatus.INTERNAL_SERVER_ERROR, Success: false })
        }
    }
}
