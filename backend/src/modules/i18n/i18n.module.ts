import { Global, Module } from '@nestjs/common';
import { I18nController } from './i18n.controller';
import { I18nService } from './application/i18n.service';
import { I18nHttpController } from './presentation/http/controllers/i18n.http.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { I18nInterceptor } from './presentation/http/i18n.interceptor';
import { I18N_REPOSITORY } from './domain/repositories/i18n.repository';
import { JsonI18nRepository } from './infrastructure/json/i18n.json.repository';

@Global()
@Module({
  imports: [],
  providers: [
    I18nService,
    { provide: APP_INTERCEPTOR, useClass: I18nInterceptor },
    {
      provide: I18N_REPOSITORY,
      useFactory: () =>
        new JsonI18nRepository('src/modules/i18n/infrastructure/messages'),
    },
  ],
  controllers: [I18nController, I18nHttpController],
  exports: [I18nService],
})
export class I18nModule {}
