import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '@shared/application/usecase.interface';
import {
  CATALOG_REPOSITORY,
  type CatalogRepository,
} from '../../domain/repositories/catalog.repository';
import { LocalizedCategory } from '../../domain/models';

export interface GetCategoriesRequest {
  locale: string;
}

export interface GetCategoriesResponse {
  categories: LocalizedCategory[];
}

@Injectable()
export class GetCategoriesUseCase
  implements UseCase<GetCategoriesRequest, GetCategoriesResponse>
{
  constructor(
    @Inject(CATALOG_REPOSITORY) private readonly repo: CatalogRepository,
  ) {}

  execute(request: GetCategoriesRequest): GetCategoriesResponse {
    const translations = new Map(
      this.repo
        .getCategoryTranslations()
        .filter((ct) => ct.languageCode === request.locale)
        .map((ct) => [ct.categoryId, ct]),
    );

    const categories = this.repo
      .getCategories()
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((c) => {
        const tr = translations.get(c.id);
        return {
          id: c.id,
          name: tr?.name ?? c.id,
          description: tr?.description,
          displayOrder: c.displayOrder,
        } as LocalizedCategory;
      });

    return { categories };
  }
}
