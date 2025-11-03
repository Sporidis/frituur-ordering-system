export interface I18nMessageStore {
  getLocales(): string[];
  getMessages(locale: string): Record<string, string>;
}

export const I18N_MESSAGE_STORE = 'I18N_MESSAGE_STORE';
