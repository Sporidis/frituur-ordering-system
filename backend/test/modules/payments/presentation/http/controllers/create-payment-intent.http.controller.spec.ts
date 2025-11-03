import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentIntentHttpController } from '@modules/payments/presentation/http/controllers/create-payment-intent.http.controller';
import { CreatePaymentIntentEndpoint } from '@modules/payments/presentation/http/endpoints/create-payment-intent.endpoint';

describe('CreatePaymentIntentHttpController', () => {
  let controller: CreatePaymentIntentHttpController;
  let endpoint: jest.Mocked<CreatePaymentIntentEndpoint>;

  beforeEach(async () => {
    endpoint = { handle: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePaymentIntentHttpController,
        { provide: CreatePaymentIntentEndpoint, useValue: endpoint },
      ],
    }).compile();

    controller = module.get(CreatePaymentIntentHttpController);
  });

  it('should delegate to endpoint with locale', async () => {
    endpoint.handle.mockResolvedValue({ success: true } as any);

    const body = {
      amount: 10.5,
      currency: 'EUR',
      customerId: 'c1',
      orderId: 'o1',
      paymentMethod: 'CARD',
      metadata: {},
    } as any;

    await controller.handle(body, 'en');

    expect(endpoint.handle).toHaveBeenCalledWith({ ...body, locale: 'en' });
  });
});
