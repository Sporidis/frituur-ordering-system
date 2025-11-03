import { Controller, Get, Query } from '@nestjs/common';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';
import {
  GetCategoriesUseCase,
  GetMenuItemsUseCase,
} from '@modules/catalog/application/use-cases';

@Controller('catalog')
export class CatalogHttpController {
  constructor(
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly getMenuItemsUseCase: GetMenuItemsUseCase,
  ) {}

  @Get('categories')
  categories(@CurrentLocale() locale: string) {
    const result = this.getCategoriesUseCase.execute({ locale });
    return { success: true, categories: result.categories };
  }

  @Get('items')
  items(
    @CurrentLocale() locale: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const result = this.getMenuItemsUseCase.execute({ locale, categoryId });
    return { success: true, items: result.items };
  }
}
