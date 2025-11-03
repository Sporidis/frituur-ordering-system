import { Injectable } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { SimulateKitchenController } from '@modules/kitchen/presentation/controllers/simulate-kitchen.controller';
import { KitchenPresenters } from '@modules/kitchen/presentation/http/presenters/kitchen.presenters';
import { I18nService } from '@modules/i18n/application/i18n.service';

@Injectable()
export class SimulateKitchenEndpoint implements Endpoint {
  constructor(
    private readonly controller: SimulateKitchenController,
    private readonly i18n: I18nService,
  ) {}

  handle(dto: { locale: string }) {
    this.controller.handle({});
    const message = this.i18n.translate(
      'kitchen_simulation_started',
      {},
      dto.locale,
    );
    return KitchenPresenters.started(message);
  }
}
