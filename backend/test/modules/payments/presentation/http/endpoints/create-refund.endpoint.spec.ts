import { Test, TestingModule } from '@nestjs/testing';
import { CreateRefundEndpoint } from '@modules/payments/presentation/http/endpoints/create-refund.endpoint';
import { CreateRefundController } from '@modules/payments/presentation/controllers/create-refund.controller';
import { I18nService } from '@modules/i18n/application/i18n.service';

describe('CreateRefundEndpoint', () => {
  let endpoint: CreateRefundEndpoint;
  let controller: jest.Mocked<CreateRefundController>;
  let i18n: jest.Mocked<I18nService>;

  beforeEach(async () => {
    controller = { handle: jest.fn() } as any;
    i18n = { translate: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRefundEndpoint,
        { provide: CreateRefundController, useValue: controller },
        { provide: I18nService, useValue: i18n },
      ],
    }).compile();

    endpoint = module.get(CreateRefundEndpoint);
  });

  it('should present refund with localized message', async () => {
    controller.handle.mockResolvedValue({
      refundId: 're_1',
      status: 'succeeded',
    });
    i18n.translate.mockReturnValue('Refund created');

    const res = await endpoint.handle({
      paymentIntentId: 'pi_1',
      amount: 500,
      reason: 'requested_by_customer',
      locale: 'nl',
    } as any);

    expect(res.success).toBe(true);
    expect((res as any).refund.id).toBe('re_1');
    expect((res as any).message).toBe('Refund created');
  });
});
