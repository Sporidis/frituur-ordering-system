import { Test, TestingModule } from '@nestjs/testing';
import { SimulateKitchenHttpController } from '@modules/kitchen/presentation/http/controllers/simulate-kitchen.http.controller';
import { SimulateKitchenEndpoint } from '@modules/kitchen/presentation/http/endpoints/simulate-kitchen.endpoint';

describe('SimulateKitchenHttpController', () => {
  let controller: SimulateKitchenHttpController;
  let endpoint: jest.Mocked<SimulateKitchenEndpoint>;

  beforeEach(async () => {
    endpoint = { handle: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulateKitchenHttpController,
        { provide: SimulateKitchenEndpoint, useValue: endpoint },
      ],
    }).compile();

    controller = module.get(SimulateKitchenHttpController);
  });

  it('should call endpoint with locale', () => {
    endpoint.handle.mockReturnValue({ success: true, message: 'Started' });

    controller.handle('en');

    expect(endpoint.handle).toHaveBeenCalledWith({ locale: 'en' });
  });
});
