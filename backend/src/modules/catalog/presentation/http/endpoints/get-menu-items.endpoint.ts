import { Injectable, Inject } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { GetMenuItemsUseCase } from '@modules/catalog/application/use-cases/get-menu-items.usecase';
import { GetMenuItemsController } from '@modules/catalog/infrastructure/http/controllers/get-menu-items.controller';
import {
  GetMenuItemsPresenter,
  GetMenuItemsHttpResponse,
} from '@modules/catalog/infrastructure/http/presenters/get-menu-items.presenter';
import { CATALOG_REPOSITORY } from '@modules/catalog/domain/repositories/catalog.repository';
import type { CatalogRepository } from '@modules/catalog/domain/repositories/catalog.repository';
import { CatalogPresenters } from '../presenters/catalog.presenters';

@Injectable()
export class GetMenuItemsEndpoint implements Endpoint {
  constructor(
    @Inject(CATALOG_REPOSITORY)
    private readonly catalogRepository: CatalogRepository,
    private readonly i18n: I18nService,
  ) {}

  async handle(dto: {
    locale: string;
    categoryId?: string;
  }): Promise<ReturnType<typeof CatalogPresenters.items>> {
    const device = new RequestResponse<GetMenuItemsHttpResponse>();
    const presenter = new GetMenuItemsPresenter(device);
    const useCase = new GetMenuItemsUseCase(presenter, this.catalogRepository);
    const controller = new GetMenuItemsController(useCase);

    await controller.handle({
      locale: dto.locale,
      categoryId: dto.categoryId,
    });

    const response = device.response;
    if (!response) {
      throw new Error('No response captured from use case');
    }

    const title = this.i18n.translate('catalog_items_title', {}, dto.locale);

    return CatalogPresenters.items(response.items, title);
  }
}
