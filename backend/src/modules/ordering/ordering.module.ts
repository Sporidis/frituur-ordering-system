import { Module } from '@nestjs/common';
import { ORDER_USE_CASES } from './application/use-cases';
import { ORDER_HTTP_ENDPOINTS } from './presentation/http/endpoints';
import { ORDER_HTTP_CONTROLLERS } from './presentation/controllers';
import { ORDER_NEST_CONTROLLERS } from './presentation/http/controllers';
import { OrderService } from './order.service';
import { ORDER_REPOSITORY } from './domain/repositories/order.repository';
import { PricingModule } from '@modules/pricing/pricing.module';
import { OrderTrackingGateway } from './infrastructure/order-tracking.gateway';

@Module({
  imports: [PricingModule],
  providers: [
    OrderService,
    OrderTrackingGateway,
    { provide: ORDER_REPOSITORY, useExisting: OrderService },
    ...ORDER_USE_CASES,
    ...ORDER_HTTP_CONTROLLERS,
    ...ORDER_HTTP_ENDPOINTS,
  ],
  controllers: [...ORDER_NEST_CONTROLLERS],
  exports: [OrderService, OrderTrackingGateway, ORDER_REPOSITORY],
})
export class OrderingModule {}
