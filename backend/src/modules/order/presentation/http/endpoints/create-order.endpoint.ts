import { Injectable, Inject } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { CreateOrderUseCase } from '@modules/order/application/use-cases/create-order.usecase';
import { CreateOrderController } from '@modules/order/infrastructure/http/controllers/create-order.controller';
import { CreateOrderPresenter } from '@modules/order/infrastructure/http/presenters/create-order.presenter';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';
import type { OrderRepository } from '@modules/order/domain/repositories/order.repository';
import type { CreateOrderHttpResponse } from '../dto/create-order.response';
import { CreateOrderEndpointDto } from '../dto/create-order-endpoint.dto';

@Injectable()
export class CreateOrderEndpoint implements Endpoint {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    private readonly i18n: I18nService,
  ) {}

  async handle(dto: CreateOrderEndpointDto): Promise<CreateOrderHttpResponse> {
    // Create RequestResponse device to capture output
    const device = new RequestResponse<CreateOrderHttpResponse>();

    // Create presenter that implements OutputPort
    const presenter = new CreateOrderPresenter(device);

    // Create use case with presenter and repository (manual construction for per-request OutputPort)
    const useCase = new CreateOrderUseCase(presenter, this.orderRepository);

    // Create controller with use case
    const controller = new CreateOrderController(useCase);

    // Execute the controller
    await controller.handle({
      customerName: dto.customerName,
      items: dto.items,
    });

    // Extract response from device
    const response = device.response;
    if (!response) {
      throw new Error('No response captured from use case');
    }

    // Add i18n message
    const message = this.getSuccessMessage(response.order.id, dto.locale);
    response.message = message;

    return response;
  }

  private getSuccessMessage(orderId: string, locale: string): string {
    return this.i18n.translate(
      'order_created_success',
      { id: orderId },
      locale,
    );
  }
}
