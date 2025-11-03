import { Module } from '@nestjs/common';
import { ORDER_USE_CASES } from './application/use-cases';
import { ORDER_HTTP_ENDPOINTS } from './presentation/http/endpoints';
import { ORDER_HTTP_CONTROLLERS } from './presentation/controllers';
import { ORDER_NEST_CONTROLLERS } from './presentation/http/controllers';
import { OrderService } from './order.service';

@Module({
  imports: [],
  providers: [
    OrderService,
    ...ORDER_USE_CASES,
    ...ORDER_HTTP_CONTROLLERS,
    ...ORDER_HTTP_ENDPOINTS,
  ],
  controllers: [...ORDER_NEST_CONTROLLERS],
  exports: [OrderService],
})
export class OrderingModule {}
