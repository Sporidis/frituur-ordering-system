import { Inject } from '@nestjs/common';
import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import {
  CATALOG_REPOSITORY,
  type CatalogRepository,
} from '../../domain/repositories/catalog.repository';
import { CategoryEntity } from '../../domain/category.entity';
import type { LocalizedCategory } from '../../domain/models';

export interface GetCategoriesRequest {
  locale: string;
}

export interface GetCategoriesResponse {
  categories: LocalizedCategory[];
}

export class GetCategoriesUseCase implements UseCase<GetCategoriesRequest> {
  constructor(
    private readonly outputPort: OutputPort<GetCategoriesResponse>,
    @Inject(CATALOG_REPOSITORY) private readonly repo: CatalogRepository,
  ) {}

  async execute(input: GetCategoriesRequest): Promise<void> {
    const categories = CategoryEntity.sortByDisplayOrder(
      await this.repo.getCategories(),
    );
    const translations = (await this.repo.getCategoryTranslations()).filter(
      (ct) => ct.languageCode === input.locale,
    );
    const localizedCategories = CategoryEntity.localizeCategories(
      categories,
      translations,
    );

    this.outputPort.present({ categories: localizedCategories });
  }
}
