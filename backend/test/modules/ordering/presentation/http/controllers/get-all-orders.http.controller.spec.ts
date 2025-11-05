import { Test, TestingModule } from '@nestjs/testing';
import { GetAllOrdersHttpController } from '@modules/order/presentation/http/controllers/get-all-orders.http.controller';
import { GetAllOrdersEndpoint } from '@modules/order/presentation/http/endpoints/get-all-orders.endpoint';

describe('GetAllOrdersHttpController', () => {
  let controller: GetAllOrdersHttpController;
  let endpoint: jest.Mocked<GetAllOrdersEndpoint>;

  beforeEach(async () => {
    endpoint = { handle: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllOrdersHttpController,
        { provide: GetAllOrdersEndpoint, useValue: endpoint },
      ],
    }).compile();

    controller = module.get(GetAllOrdersHttpController);
  });

  it('should call endpoint with locale', () => {
    endpoint.handle.mockReturnValue({ success: true, orders: [], count: 0 });

    controller.handle('en');

    expect(endpoint.handle).toHaveBeenCalledWith({ locale: 'en' });
  });
});
