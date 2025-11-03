import { Controller, Get } from '@nestjs/common';

@Controller('i18n')
export class I18nController {
  @Get('ping')
  ping() {
    return { module: 'i18n', status: 'ok' };
  }
}
