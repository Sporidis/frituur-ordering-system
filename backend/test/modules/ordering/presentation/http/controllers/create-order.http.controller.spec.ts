import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderHttpController } from '@modules/order/presentation/http/controllers/create-order.http.controller';
import { CreateOrderEndpoint } from '@modules/order/presentation/http/endpoints/create-order.endpoint';

describe('CreateOrderHttpController', () => {
  let controller: CreateOrderHttpController;
  let endpoint: jest.Mocked<CreateOrderEndpoint>;

  beforeEach(async () => {
    endpoint = { handle: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderHttpController,
        { provide: CreateOrderEndpoint, useValue: endpoint },
      ],
    }).compile();

    controller = module.get(CreateOrderHttpController);
  });

  it('should call endpoint with body and locale', () => {
    endpoint.handle.mockReturnValue({
      success: true,
      order: {} as any,
      message: 'Created',
    });

    const body = { customerName: 'John', items: [] };
    const locale = 'en';

    controller.handle(body, locale);

    expect(endpoint.handle).toHaveBeenCalledWith({ ...body, locale });
  });
});
