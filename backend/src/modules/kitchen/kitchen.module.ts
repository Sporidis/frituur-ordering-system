import { Module } from '@nestjs/common';
import { OrderingModule } from '@modules/ordering/ordering.module';
import { KITCHEN_CONTROLLERS } from './presentation/controllers';
import { KITCHEN_HTTP_CONTROLLERS } from './presentation/http/controllers';
import { KITCHEN_USE_CASES } from './application/use-cases';
import { KITCHEN_HTTP_ENDPOINTS } from './presentation/http/endpoints';

@Module({
  imports: [OrderingModule],
  providers: [
    ...KITCHEN_USE_CASES,
    ...KITCHEN_CONTROLLERS,
    ...KITCHEN_HTTP_ENDPOINTS,
  ],
  controllers: [...KITCHEN_HTTP_CONTROLLERS],
  exports: [],
})
export class KitchenModule {}
