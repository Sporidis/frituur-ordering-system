import { Test, TestingModule } from '@nestjs/testing';
import { GetOrderHttpController } from '@modules/order/presentation/http/controllers/get-order.http.controller';
import { GetOrderEndpoint } from '@modules/order/presentation/http/endpoints/get-order.endpoint';

describe('GetOrderHttpController', () => {
  let controller: GetOrderHttpController;
  let endpoint: jest.Mocked<GetOrderEndpoint>;

  beforeEach(async () => {
    endpoint = { handle: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOrderHttpController,
        { provide: GetOrderEndpoint, useValue: endpoint },
      ],
    }).compile();

    controller = module.get(GetOrderHttpController);
  });

  it('should call endpoint with id and locale', () => {
    endpoint.handle.mockReturnValue({ success: true, order: {} as any });

    controller.handle('o1', 'en');

    expect(endpoint.handle).toHaveBeenCalledWith({ id: 'o1', locale: 'en' });
  });
});
