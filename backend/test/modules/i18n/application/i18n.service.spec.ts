import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { I18N_REPOSITORY } from '@modules/i18n/domain/repositories/i18n.repository';

describe('I18nService', () => {
  let service: I18nService;
  let repo: any;

  beforeEach(async () => {
    repo = {
      getLocales: jest.fn().mockReturnValue(['en', 'nl']),
      getMessages: jest.fn().mockReturnValue({ greeting: 'Hello {name}' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [I18nService, { provide: I18N_REPOSITORY, useValue: repo }],
    }).compile();

    service = module.get(I18nService);
  });

  it('should return locales', () => {
    expect(service.getLocales()).toEqual(['en', 'nl']);
  });

  it('should return messages of a locale', () => {
    expect(service.getMessages('en')).toEqual({ greeting: 'Hello {name}' });
    expect(repo.getMessages).toHaveBeenCalledWith('en');
  });

  it('should translate with params and fallback to key if missing', () => {
    const msg = service.translate('greeting', { name: 'Nikos' }, 'en');
    expect(msg).toBe('Hello Nikos');

    // missing key fallback
    expect(service.translate('missing_key', {}, 'en')).toBe('missing_key');
  });
});
