import { I18nInterceptor } from '@modules/i18n/presentation/http/i18n.interceptor';

function createContext(query: any = {}, headers: any = {}) {
  const req = { query, headers } as any;
  return {
    switchToHttp: () => ({
      getRequest: () => req,
    }),
  } as any;
}

describe('I18nInterceptor', () => {
  const interceptor = new I18nInterceptor();

  it('sets locale from query lang', () => {
    const ctx = createContext({ lang: 'nl' }, {});
    const next = { handle: jest.fn().mockReturnValue('ok') } as any;

    interceptor.intercept(ctx as any, next);
    expect((ctx.switchToHttp().getRequest() as any).locale).toBe('nl');
  });

  it('sets locale from accept-language header when no query', () => {
    const ctx = createContext({}, { 'accept-language': 'en-US,en;q=0.9' });
    const next = { handle: jest.fn().mockReturnValue('ok') } as any;

    interceptor.intercept(ctx as any, next);

    expect((ctx.switchToHttp().getRequest() as any).locale).toBe('en-US');
  });
});
