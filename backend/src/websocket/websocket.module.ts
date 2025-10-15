import { Module } from '@nestjs/common';
import { OrderGateway } from './order.gateway';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  providers: [OrderGateway, OrderService],
  controllers: [OrderController],
  exports: [OrderGateway, OrderService],
})
export class WebSocketModule {}
