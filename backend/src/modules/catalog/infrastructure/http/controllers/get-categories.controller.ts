import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { GetCategoriesRequest } from '@modules/catalog/application/use-cases/get-categories.usecase';

export interface GetCategoriesControllerRequest {
  locale: string;
}

@Injectable()
export class GetCategoriesController {
  constructor(private readonly useCase: UseCase<GetCategoriesRequest>) {}

  async handle(request: GetCategoriesControllerRequest): Promise<void> {
    const useCaseInput = this.mapToUseCaseInput(request);
    await this.useCase.execute(useCaseInput);
  }

  private mapToUseCaseInput(
    request: GetCategoriesControllerRequest,
  ): GetCategoriesRequest {
    return { locale: request.locale };
  }
}
