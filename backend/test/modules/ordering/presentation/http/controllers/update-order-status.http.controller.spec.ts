import { Test, TestingModule } from '@nestjs/testing';
import { UpdateOrderStatusHttpController } from '@modules/ordering/presentation/http/controllers/update-order-status.http.controller';
import { UpdateOrderStatusEndpoint } from '@modules/ordering/presentation/http/endpoints/update-order-status.endpoint';
import { OrderStatus } from '@modules/ordering/domain/order.types';

describe('UpdateOrderStatusHttpController', () => {
  let controller: UpdateOrderStatusHttpController;
  let endpoint: jest.Mocked<UpdateOrderStatusEndpoint>;

  beforeEach(async () => {
    endpoint = { handle: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateOrderStatusHttpController,
        { provide: UpdateOrderStatusEndpoint, useValue: endpoint },
      ],
    }).compile();

    controller = module.get(UpdateOrderStatusHttpController);
  });

  it('should call endpoint with params and locale', () => {
    endpoint.handle.mockReturnValue({ success: true, message: 'Updated' });

    controller.handle('o1', { status: OrderStatus.READY }, 'en');

    expect(endpoint.handle).toHaveBeenCalledWith({
      id: 'o1',
      status: OrderStatus.READY,
      locale: 'en',
    });
  });
});
