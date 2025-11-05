import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { GetAllOrdersRequest } from '@modules/order/application/contracts/requests/get-all-orders.request';

@Injectable()
export class GetAllOrdersController {
  constructor(private readonly useCase: UseCase<GetAllOrdersRequest>) {}

  async handle(): Promise<void> {
    await this.useCase.execute({});
  }
}
