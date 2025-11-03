import { Module } from '@nestjs/common';
import { PaymentsModule } from './modules/payments/payments.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { OrderingModule } from './modules/ordering/ordering.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { KitchenModule } from './modules/kitchen/kitchen.module';
import { I18nModule } from './modules/i18n/i18n.module';

@Module({
  imports: [
    PaymentsModule,
    CatalogModule,
    OrderingModule,
    PricingModule,
    KitchenModule,
    I18nModule,
  ],
})
export class AppModule {}
