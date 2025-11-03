import { Injectable } from '@nestjs/common';
import { CreateOrderUseCase } from '@modules/ordering/application/use-cases';
import {
  CreateOrderRequest,
  CreateOrderResponse,
} from '@modules/ordering/application/contracts';
import { Controller } from '@shared/presentation/contracts/controller.interface';

@Injectable()
export class CreateOrderController implements Controller<CreateOrderRequest, CreateOrderResponse> {
  constructor(private readonly useCase: CreateOrderUseCase) {}

  handle(request: CreateOrderRequest): CreateOrderResponse {
    return this.useCase.execute(request);
  }
}
