import { Controller, Get, Query } from '@nestjs/common';
import { CatalogQueryService } from '../../../application/catalog.query.service';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';

@Controller('catalog')
export class CatalogHttpController {
  constructor(private readonly queries: CatalogQueryService) {}

  @Get('categories')
  categories(@CurrentLocale() locale: string) {
    return { success: true, categories: this.queries.getCategories(locale) };
  }

  @Get('items')
  items(
    @CurrentLocale() locale: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return { success: true, items: this.queries.getItems(locale, categoryId) };
  }
}
