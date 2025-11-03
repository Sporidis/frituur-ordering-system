import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentIntentEndpoint } from '@modules/payments/presentation/http/endpoints/create-payment-intent.endpoint';
import { CreatePaymentIntentController } from '@modules/payments/presentation/controllers/create-payment-intent.controller';
import { I18nService } from '@modules/i18n/application/i18n.service';

describe('CreatePaymentIntentEndpoint', () => {
  let endpoint: CreatePaymentIntentEndpoint;
  let controller: jest.Mocked<CreatePaymentIntentController>;
  let i18n: jest.Mocked<I18nService>;

  beforeEach(async () => {
    controller = { handle: jest.fn() } as any;
    i18n = { translate: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePaymentIntentEndpoint,
        { provide: CreatePaymentIntentController, useValue: controller },
        { provide: I18nService, useValue: i18n },
      ],
    }).compile();

    endpoint = module.get(CreatePaymentIntentEndpoint);
  });

  it('should present created intent with localized message', async () => {
    controller.handle.mockResolvedValue({
      paymentIntentId: 'pi_1',
      clientSecret: 'secret',
    } as any);
    i18n.translate.mockReturnValue('Created');

    const body = {
      amount: 1050,
      currency: 'EUR',
      customerId: 'c1',
      orderId: 'o1',
      paymentMethod: 'CARD',
      metadata: {},
      locale: 'en',
    } as any;

    const res = await endpoint.handle(body);

    expect(res.success).toBe(true);
    expect((res as any).paymentIntent.id).toBe('pi_1');
    expect((res as any).message).toBe('Created');
    expect(i18n.translate).toHaveBeenCalled();
  });
});
