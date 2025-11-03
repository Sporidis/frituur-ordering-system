import { Injectable } from '@nestjs/common';
import { Endpoint } from '../../../../../shared/presentation/http/endpoint.interface';

@Injectable()
export class GetConfigEndpoint implements Endpoint {
  async handle() {
    return {
      success: true,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    };
  }
}
