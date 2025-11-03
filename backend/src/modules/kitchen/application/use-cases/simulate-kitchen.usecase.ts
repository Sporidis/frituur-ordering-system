import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/application/usecase.interface';
import {
  SimulateKitchenRequest,
  SimulateKitchenResponse,
} from '@modules/kitchen/application/contracts';
import { OrderService } from '@modules/ordering/order.service';

@Injectable()
export class SimulateKitchenUseCase
  implements UseCase<SimulateKitchenRequest, SimulateKitchenResponse>
{
  constructor(private readonly orders: OrderService) {}

  execute(_: SimulateKitchenRequest): SimulateKitchenResponse {
    this.orders.simulateKitchenWorkflow();
    return { message: 'Simulation started' };
  }
}
