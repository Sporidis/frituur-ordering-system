import { Test, TestingModule } from '@nestjs/testing';
import { CreateRefundHttpController } from '@modules/payments/presentation/http/controllers/create-refund.http.controller';
import { CreateRefundEndpoint } from '@modules/payments/presentation/http/endpoints/create-refund.endpoint';

describe('CreateRefundHttpController', () => {
  let controller: CreateRefundHttpController;
  let endpoint: jest.Mocked<CreateRefundEndpoint>;

  beforeEach(async () => {
    endpoint = { handle: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRefundHttpController,
        { provide: CreateRefundEndpoint, useValue: endpoint },
      ],
    }).compile();

    controller = module.get(CreateRefundHttpController);
  });

  it('should delegate to endpoint with locale', async () => {
    endpoint.handle.mockResolvedValue({ success: true } as any);

    const body = {
      paymentIntentId: 'pi_1',
      amount: 500,
      reason: 'requested_by_customer',
    } as any;

    await controller.handle(body, 'nl');

    expect(endpoint.handle).toHaveBeenCalledWith({ ...body, locale: 'nl' });
  });
});
