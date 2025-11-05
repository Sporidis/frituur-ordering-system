import { Test, TestingModule } from '@nestjs/testing';
import { GetOrderEndpoint } from '@modules/order/presentation/http/endpoints/get-order.endpoint';
import { GetOrderController } from '@modules/order/presentation/controllers/get-order.controller';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { OrderStatus } from '@modules/order/domain/order.types';

describe('GetOrderEndpoint', () => {
  let endpoint: GetOrderEndpoint;
  let controller: jest.Mocked<GetOrderController>;
  let i18n: jest.Mocked<I18nService>;

  beforeEach(async () => {
    controller = { handle: jest.fn() } as any;
    i18n = { translate: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOrderEndpoint,
        { provide: GetOrderController, useValue: controller },
        { provide: I18nService, useValue: i18n },
      ],
    }).compile();

    endpoint = module.get(GetOrderEndpoint);
  });

  it('should return order with localized title when found', () => {
    controller.handle.mockReturnValue({
      order: {
        id: 'o1',
        customerName: 'John',
        totalAmount: 10.5,
        status: OrderStatus.PENDING,
      } as any,
    });
    i18n.translate.mockReturnValue('Order Details');

    const res = endpoint.handle({ id: 'o1', locale: 'en' });

    expect(res.success).toBe(true);
    expect((res as any).order.id).toBe('o1');
    expect((res as any).title).toBe('Order Details');
  });

  it('should return error when order not found', () => {
    controller.handle.mockReturnValue({ order: undefined });
    i18n.translate.mockReturnValue('Order not found');

    const res = endpoint.handle({ id: 'invalid', locale: 'en' });

    expect(res.success).toBe(false);
    expect((res as any).message).toBe('Order not found');
  });
});
