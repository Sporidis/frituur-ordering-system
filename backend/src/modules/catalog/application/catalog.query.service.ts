import { Inject, Injectable } from '@nestjs/common';
import {
  CATALOG_REPOSITORY,
  type CatalogRepository,
} from '../domain/repositories/catalog.repository';
import { LocalizedCategory, LocalizedMenuItem } from '../domain/models';
@Injectable()
export class CatalogQueryService {
  constructor(
    @Inject(CATALOG_REPOSITORY) private readonly repo: CatalogRepository,
  ) {}

  getCategories(locale: string): LocalizedCategory[] {
    const t = new Map(
      this.repo
        .getCategoryTranslations()
        .filter((ct) => ct.languageCode === locale)
        .map((ct) => [ct.categoryId, ct]),
    );
    return this.repo
      .getCategories()
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((c) => {
        const tr = t.get(c.id);
        return {
          id: c.id,
          name: tr?.name ?? c.id,
          description: tr?.description,
          displayOrder: c.displayOrder,
        } as LocalizedCategory;
      });
  }

  getItems(locale: string, categoryId?: string): LocalizedMenuItem[] {
    const t = new Map(
      this.repo
        .getMenuItemTranslations()
        .filter((mt) => mt.languageCode === locale)
        .map((mt) => [mt.menuItemId, mt]),
    );
    return this.repo
      .getMenuItems()
      .filter((i) => !categoryId || i.categoryId === categoryId)
      .map((i) => {
        const tr = t.get(i.id);
        return {
          id: i.id,
          categoryId: i.categoryId,
          name: tr?.name ?? i.id,
          description: tr?.description,
          price: i.basePrice,
          preparationTimeMinutes: i.preparationTimeMinutes,
          allergens: i.allergens,
          isAvailable: i.isAvailable,
        } as LocalizedMenuItem;
      });
  }
}
