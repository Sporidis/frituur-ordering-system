import { Injectable } from '@nestjs/common';
import { renderElementsPage } from '../../views/elements.page';
import { Endpoint } from '../../../../../shared/presentation/http/endpoint.interface';

@Injectable()
export class GetElementsPageEndpoint implements Endpoint {
  async handle(
    clientSecret?: string,
    publishableKey?: string,
  ): Promise<string> {
    const pk = publishableKey || process.env.STRIPE_PUBLISHABLE_KEY || '';
    const cs = clientSecret || '';
    return renderElementsPage(pk, cs);
  }
}
