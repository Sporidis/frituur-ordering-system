import { Injectable } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { QuoteOrderUseCase } from '@modules/order/application/use-cases/quote-order.usecase';
import { QuoteOrderController } from '@modules/order/infrastructure/http/controllers/quote-order.controller';
import { QuoteOrderPresenter } from '@modules/order/infrastructure/http/presenters/quote-order.presenter';
import type { QuoteOrderHttpResponse } from '../dto/quote-order.response';

@Injectable()
export class QuoteOrderEndpoint implements Endpoint {
  constructor(private readonly i18n: I18nService) {}

  async handle(dto: {
    items: Array<{ name: string; price: number; quantity: number }>;
    locale: string;
  }): Promise<QuoteOrderHttpResponse> {
    const device = new RequestResponse<QuoteOrderHttpResponse>();
    const presenter = new QuoteOrderPresenter(device);
    const useCase = new QuoteOrderUseCase(presenter);
    const controller = new QuoteOrderController(useCase);

    await controller.handle({ items: dto.items });

    const response = device.response;
    if (!response) {
      throw new Error('No response captured from use case');
    }

    const title = this.i18n.translate('pricing_quote_title', {}, dto.locale);

    return {
      ...response,
      ...(title ? { title } : {}),
    };
  }
}
