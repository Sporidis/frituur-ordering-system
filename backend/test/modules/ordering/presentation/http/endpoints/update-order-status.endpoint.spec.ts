import { Test, TestingModule } from '@nestjs/testing';
import { UpdateOrderStatusEndpoint } from '@modules/ordering/presentation/http/endpoints/update-order-status.endpoint';
import { UpdateOrderStatusController } from '@modules/ordering/presentation/controllers/update-order-status.controller';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { OrderStatus } from '@modules/ordering/domain/order.types';

describe('UpdateOrderStatusEndpoint', () => {
  let endpoint: UpdateOrderStatusEndpoint;
  let controller: jest.Mocked<UpdateOrderStatusController>;
  let i18n: jest.Mocked<I18nService>;

  beforeEach(async () => {
    controller = { handle: jest.fn() } as any;
    i18n = { translate: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateOrderStatusEndpoint,
        { provide: UpdateOrderStatusController, useValue: controller },
        { provide: I18nService, useValue: i18n },
      ],
    }).compile();

    endpoint = module.get(UpdateOrderStatusEndpoint);
  });

  it('should return success message when status updated', () => {
    controller.handle.mockReturnValue({ success: true });
    i18n.translate.mockReturnValue('Order status updated');

    const res = endpoint.handle({
      id: 'o1',
      status: OrderStatus.READY,
      locale: 'en',
    });

    expect(res.success).toBe(true);
    expect((res as any).message).toBe('Order status updated');
    expect(i18n.translate).toHaveBeenCalledWith(
      'order_status_updated_success',
      { id: 'o1', status: OrderStatus.READY },
      'en',
    );
  });

  it('should return error when order not found', () => {
    controller.handle.mockReturnValue({ success: false });
    i18n.translate.mockReturnValue('Order not found');

    const res = endpoint.handle({
      id: 'invalid',
      status: OrderStatus.READY,
      locale: 'en',
    });

    expect(res.success).toBe(false);
    expect(res.message).toBe('Order not found');
  });
});
