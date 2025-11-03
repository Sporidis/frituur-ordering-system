import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderEndpoint } from '@modules/ordering/presentation/http/endpoints/create-order.endpoint';
import { CreateOrderController } from '@modules/ordering/presentation/controllers/create-order.controller';
import { I18nService } from '@modules/i18n/application/i18n.service';

describe('CreateOrderEndpoint', () => {
  let endpoint: CreateOrderEndpoint;
  let controller: jest.Mocked<CreateOrderController>;
  let i18n: jest.Mocked<I18nService>;

  beforeEach(async () => {
    controller = { handle: jest.fn() } as any;
    i18n = { translate: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderEndpoint,
        { provide: CreateOrderController, useValue: controller },
        { provide: I18nService, useValue: i18n },
      ],
    }).compile();

    endpoint = module.get(CreateOrderEndpoint);
  });

  it('should return presented order with localized message', () => {
    controller.handle.mockReturnValue({
      id: 'o1',
      customerName: 'John',
      totalAmount: 10.5,
      status: 'pending',
    });
    i18n.translate.mockReturnValue('Order created successfully');

    const dto = {
      customerName: 'John',
      items: [{ name: 'Fries', price: 3, quantity: 1 }],
      locale: 'en',
    };

    const res = endpoint.handle(dto);

    expect(res.success).toBe(true);
    expect(res.order.id).toBe('o1');
    expect(res.message).toBe('Order created successfully');
    expect(i18n.translate).toHaveBeenCalledWith(
      'order_created_success',
      { id: 'o1' },
      'en',
    );
  });
});
