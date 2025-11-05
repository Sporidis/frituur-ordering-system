import { Controller, Get, Query } from '@nestjs/common';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';
import { GetCategoriesEndpoint } from '../endpoints/get-categories.endpoint';
import { GetMenuItemsEndpoint } from '../endpoints/get-menu-items.endpoint';

@Controller('catalog')
export class CatalogHttpController {
  constructor(
    private readonly getCategoriesEndpoint: GetCategoriesEndpoint,
    private readonly getMenuItemsEndpoint: GetMenuItemsEndpoint,
  ) {}

  @Get('categories')
  categories(@CurrentLocale() locale: string) {
    return this.getCategoriesEndpoint.handle({ locale });
  }

  @Get('items')
  items(
    @CurrentLocale() locale: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.getMenuItemsEndpoint.handle({ locale, categoryId });
  }
}
