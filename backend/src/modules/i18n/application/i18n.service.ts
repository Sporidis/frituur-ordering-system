import { Inject, Injectable } from '@nestjs/common';
import { I18N_REPOSITORY } from '../domain/repositories/i18n.repository';
import type { I18nRepository } from '../domain/repositories/i18n.repository';

@Injectable()
export class I18nService {
  constructor(
    @Inject(I18N_REPOSITORY)
    private readonly store: I18nRepository,
  ) {}

  getLocales() {
    return this.store.getLocales();
  }

  getMessages(locale: string) {
    return this.store.getMessages(locale);
  }

  translate(
    key: string,
    params: Record<string, string | number> = {},
    locale: string = 'en',
  ) {
    const bundle = this.getMessages(locale);
    const template = bundle[key] ?? key;
    return Object.keys(params).reduce(
      (acc, k) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(params[k])),
      template,
    );
  }
}
