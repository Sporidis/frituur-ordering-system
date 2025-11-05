import { Inject } from '@nestjs/common';
import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import {
  CATALOG_REPOSITORY,
  type CatalogRepository,
} from '../../domain/repositories/catalog.repository';
import { MenuItemEntity } from '../../domain/menu-item.entity';
import type { LocalizedMenuItem } from '../../domain/models';

export interface GetMenuItemsRequest {
  locale: string;
  categoryId?: string;
}

export interface GetMenuItemsResponse {
  items: LocalizedMenuItem[];
}

export class GetMenuItemsUseCase implements UseCase<GetMenuItemsRequest> {
  constructor(
    private readonly outputPort: OutputPort<GetMenuItemsResponse>,
    @Inject(CATALOG_REPOSITORY) private readonly repo: CatalogRepository,
  ) {}

  async execute(input: GetMenuItemsRequest): Promise<void> {
    const items = await this.repo.getMenuItems();
    const translations = (await this.repo.getMenuItemTranslations()).filter(
      (mt) => mt.languageCode === input.locale,
    );
    const localizedItems = MenuItemEntity.localizeMenuItems(
      items,
      translations,
      input.categoryId,
    );

    this.outputPort.present({ items: localizedItems });
  }
}
