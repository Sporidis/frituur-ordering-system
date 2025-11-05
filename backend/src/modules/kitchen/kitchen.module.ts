import { Module } from '@nestjs/common';
import { OrderModule } from '@modules/order/order.module';
import { KITCHEN_HTTP_CONTROLLERS } from './presentation/http/controllers';
import { KITCHEN_HTTP_ENDPOINTS } from './presentation/http/endpoints';

@Module({
  imports: [OrderModule],
  providers: [...KITCHEN_HTTP_ENDPOINTS],
  controllers: [...KITCHEN_HTTP_CONTROLLERS],
  exports: [],
})
export class KitchenModule {}
