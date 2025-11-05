import { Test, TestingModule } from '@nestjs/testing';
import { GetAllOrdersEndpoint } from '@modules/order/presentation/http/endpoints/get-all-orders.endpoint';
import { GetAllOrdersController } from '@modules/order/presentation/controllers/get-all-orders.controller';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { OrderStatus } from '@modules/order/domain/order.types';

describe('GetAllOrdersEndpoint', () => {
  let endpoint: GetAllOrdersEndpoint;
  let controller: jest.Mocked<GetAllOrdersController>;
  let i18n: jest.Mocked<I18nService>;

  beforeEach(async () => {
    controller = { handle: jest.fn() } as any;
    i18n = { translate: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllOrdersEndpoint,
        { provide: GetAllOrdersController, useValue: controller },
        { provide: I18nService, useValue: i18n },
      ],
    }).compile();

    endpoint = module.get(GetAllOrdersEndpoint);
  });

  it('should return presented orders list with localized title', () => {
    controller.handle.mockReturnValue({
      orders: [
        {
          id: 'o1',
          customerName: 'John',
          totalAmount: 10.5,
          status: OrderStatus.PENDING,
          items: [],
          estimatedReadyTime: new Date(),
          createdAt: new Date(),
        },
      ] as any,
    });
    i18n.translate.mockReturnValue('All Orders');

    const res = endpoint.handle({ locale: 'en' });

    expect(res.success).toBe(true);
    expect(res.orders.length).toBe(1);
    expect(res.count).toBe(1);
    expect(res.title).toBe('All Orders');
  });
});
