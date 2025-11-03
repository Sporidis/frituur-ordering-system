import { I18nHttpController } from '@modules/i18n/presentation/http/controllers/i18n.http.controller';
import { I18nService } from '@modules/i18n/application/i18n.service';

describe('I18nHttpController', () => {
  let controller: I18nHttpController;
  let service: jest.Mocked<I18nService>;

  beforeEach(() => {
    service = {
      getLocales: jest.fn().mockReturnValue(['en', 'nl']),
      getMessages: jest.fn().mockReturnValue({ hello: 'Hello' }),
    } as any;
    controller = new I18nHttpController(service);
  });

  it('should return locales with success', () => {
    const res = controller.locales();
    expect(res.success).toBe(true);
    expect(res.locales).toEqual(['en', 'nl']);
  });

  it('should return messages for locale', () => {
    const res = controller.messages('en');
    expect(res.success).toBe(true);
    expect(res.locale).toBe('en');
    expect(res.messages).toEqual({ hello: 'Hello' });
  });
});
