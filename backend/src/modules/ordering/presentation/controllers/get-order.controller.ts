import { Injectable } from '@nestjs/common';
import { GetOrderUseCase } from '@modules/ordering/application/use-cases';
import {
  GetOrderRequest,
  GetOrderResponse,
} from '@modules/ordering/application/contracts';
import { Controller } from '@shared/presentation/contracts/controller.interface';

@Injectable()
export class GetOrderController implements Controller<GetOrderRequest, GetOrderResponse> {
  constructor(private readonly useCase: GetOrderUseCase) {}

  handle(request: GetOrderRequest): GetOrderResponse {
    return this.useCase.execute(request);
  }
}
