import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { SyncStatusRequest } from '@modules/payments/application/use-cases/sync-status.usecase';

export interface SyncStatusControllerRequest {
  paymentIntentId: string;
}

@Injectable()
export class SyncStatusController {
  constructor(private readonly useCase: UseCase<SyncStatusRequest>) {}

  async handle(request: SyncStatusControllerRequest): Promise<void> {
    await this.useCase.execute({
      paymentIntentId: request.paymentIntentId,
    });
  }
}
