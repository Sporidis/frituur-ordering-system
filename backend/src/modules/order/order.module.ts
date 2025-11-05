import { Module } from '@nestjs/common';
import { ORDER_HTTP_ENDPOINTS } from './presentation/http/endpoints';
import { ORDER_NEST_CONTROLLERS } from './presentation/http/controllers';
import { InMemoryOrderRepository } from './infrastructure/inmemory/order.repository';
import { ORDER_REPOSITORY } from './domain/repositories/order.repository';
import { OrderTrackingGateway } from './infrastructure/order-tracking.gateway';

@Module({
  imports: [],
  providers: [
    InMemoryOrderRepository,
    OrderTrackingGateway,
    { provide: ORDER_REPOSITORY, useExisting: InMemoryOrderRepository },
    ...ORDER_HTTP_ENDPOINTS,
  ],
  controllers: [...ORDER_NEST_CONTROLLERS],
  exports: [InMemoryOrderRepository, OrderTrackingGateway, ORDER_REPOSITORY],
})
export class OrderModule {}
