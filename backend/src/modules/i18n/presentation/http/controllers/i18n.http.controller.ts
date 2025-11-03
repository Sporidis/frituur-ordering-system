import { Controller, Get, Query } from '@nestjs/common';
import { I18nService } from '@modules/i18n/application/i18n.service';

@Controller('i18n')
export class I18nHttpController {
  constructor(private readonly i18n: I18nService) {}

  @Get('locales')
  locales() {
    return { success: true, locales: this.i18n.getLocales() };
  }

  @Get('messages')
  messages(@Query('locale') locale: string) {
    return { success: true, locale, messages: this.i18n.getMessages(locale) };
  }
}
