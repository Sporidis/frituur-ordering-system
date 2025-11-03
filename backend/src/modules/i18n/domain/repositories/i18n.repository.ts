export interface I18nRepository {
  getLocales(): string[];
  getMessages(locale: string): Record<string, string>;
}

export const I18N_REPOSITORY = 'I18N_REPOSITORY';
