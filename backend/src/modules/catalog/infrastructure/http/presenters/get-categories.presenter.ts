import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { GetCategoriesResponse } from '@modules/catalog/application/use-cases/get-categories.usecase';
import type { LocalizedCategory } from '@modules/catalog/domain/models';

export interface GetCategoriesHttpResponse {
  success: true;
  categories: LocalizedCategory[];
  count: number;
  title?: string;
}

export class GetCategoriesPresenter
  implements OutputPort<GetCategoriesResponse>
{
  constructor(
    private readonly device: RequestResponseDevice<GetCategoriesHttpResponse>,
  ) {}

  present(output: GetCategoriesResponse): void {
    const presentedData: GetCategoriesHttpResponse = {
      success: true,
      categories: output.categories,
      count: output.categories.length,
    };
    this.device.update(presentedData);
  }
}
