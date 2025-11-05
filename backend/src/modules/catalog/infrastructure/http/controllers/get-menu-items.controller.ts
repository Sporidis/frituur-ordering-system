import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { GetMenuItemsRequest } from '@modules/catalog/application/use-cases/get-menu-items.usecase';

export interface GetMenuItemsControllerRequest {
  locale: string;
  categoryId?: string;
}

@Injectable()
export class GetMenuItemsController {
  constructor(private readonly useCase: UseCase<GetMenuItemsRequest>) {}

  async handle(request: GetMenuItemsControllerRequest): Promise<void> {
    const useCaseInput = this.mapToUseCaseInput(request);
    await this.useCase.execute(useCaseInput);
  }

  private mapToUseCaseInput(
    request: GetMenuItemsControllerRequest,
  ): GetMenuItemsRequest {
    return {
      locale: request.locale,
      categoryId: request.categoryId,
    };
  }
}
