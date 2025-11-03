import { Injectable } from '@nestjs/common';
import { SyncStatusUseCase } from '../../../application/use-cases/sync-status.usecase';
import { Endpoint } from '../../../../../shared/presentation/http/endpoint.interface';

@Injectable()
export class SyncStatusEndpoint implements Endpoint {
  constructor(private readonly useCase: SyncStatusUseCase) {}

  async handle(paymentIntentId: string) {
    const result = await this.useCase.execute(paymentIntentId);
    return { success: true, ...result };
  }
}
