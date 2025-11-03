import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '@shared/application/usecase.interface';
import {
  CATALOG_REPOSITORY,
  type CatalogRepository,
} from '../../domain/repositories/catalog.repository';
import { LocalizedMenuItem } from '../../domain/models';

export interface GetMenuItemsRequest {
  locale: string;
  categoryId?: string;
}

export interface GetMenuItemsResponse {
  items: LocalizedMenuItem[];
}

@Injectable()
export class GetMenuItemsUseCase
  implements UseCase<GetMenuItemsRequest, GetMenuItemsResponse>
{
  constructor(
    @Inject(CATALOG_REPOSITORY) private readonly repo: CatalogRepository,
  ) {}

  execute(request: GetMenuItemsRequest): GetMenuItemsResponse {
    const translations = new Map(
      this.repo
        .getMenuItemTranslations()
        .filter((mt) => mt.languageCode === request.locale)
        .map((mt) => [mt.menuItemId, mt]),
    );

    const items = this.repo
      .getMenuItems()
      .filter((i) => !request.categoryId || i.categoryId === request.categoryId)
      .map((i) => {
        const tr = translations.get(i.id);
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

    return { items };
  }
}
