import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { GetMenuItemsResponse } from '@modules/catalog/application/use-cases/get-menu-items.usecase';
import type { LocalizedMenuItem } from '@modules/catalog/domain/models';

export interface GetMenuItemsHttpResponse {
  success: true;
  items: LocalizedMenuItem[];
  count: number;
  title?: string;
}

export class GetMenuItemsPresenter implements OutputPort<GetMenuItemsResponse> {
  constructor(
    private readonly device: RequestResponseDevice<GetMenuItemsHttpResponse>,
  ) {}

  present(output: GetMenuItemsResponse): void {
    const presentedData: GetMenuItemsHttpResponse = {
      success: true,
      items: output.items,
      count: output.items.length,
    };
    this.device.update(presentedData);
  }
}
