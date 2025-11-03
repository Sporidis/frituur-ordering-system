import { Injectable } from '@nestjs/common';
import { renderReturnPage } from '../../views/elements.page';
import { Endpoint } from '../../../../../shared/presentation/http/endpoint.interface';

@Injectable()
export class GetReturnPageEndpoint implements Endpoint {
  async handle(publishableKey?: string): Promise<string> {
    const pk = publishableKey || process.env.STRIPE_PUBLISHABLE_KEY || '';
    return renderReturnPage(pk);
  }
}
