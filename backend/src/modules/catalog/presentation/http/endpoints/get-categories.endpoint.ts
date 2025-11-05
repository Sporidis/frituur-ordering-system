import { Injectable, Inject } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { GetCategoriesUseCase } from '@modules/catalog/application/use-cases/get-categories.usecase';
import { GetCategoriesController } from '@modules/catalog/infrastructure/http/controllers/get-categories.controller';
import {
  GetCategoriesPresenter,
  GetCategoriesHttpResponse,
} from '@modules/catalog/infrastructure/http/presenters/get-categories.presenter';
import { CATALOG_REPOSITORY } from '@modules/catalog/domain/repositories/catalog.repository';
import type { CatalogRepository } from '@modules/catalog/domain/repositories/catalog.repository';
import { CatalogPresenters } from '../presenters/catalog.presenters';

@Injectable()
export class GetCategoriesEndpoint implements Endpoint {
  constructor(
    @Inject(CATALOG_REPOSITORY)
    private readonly catalogRepository: CatalogRepository,
    private readonly i18n: I18nService,
  ) {}

  async handle(dto: {
    locale: string;
  }): Promise<ReturnType<typeof CatalogPresenters.categories>> {
    const device = new RequestResponse<GetCategoriesHttpResponse>();
    const presenter = new GetCategoriesPresenter(device);
    const useCase = new GetCategoriesUseCase(presenter, this.catalogRepository);
    const controller = new GetCategoriesController(useCase);

    await controller.handle({ locale: dto.locale });

    const response = device.response;
    if (!response) {
      throw new Error('No response captured from use case');
    }

    const title = this.i18n.translate(
      'catalog_categories_title',
      {},
      dto.locale,
    );

    return CatalogPresenters.categories(response.categories, title);
  }
}
