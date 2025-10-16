import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebSocketModule } from './websocket/websocket.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [WebSocketModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
