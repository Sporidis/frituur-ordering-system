import { Test, TestingModule } from '@nestjs/testing';
import { SimulateKitchenEndpoint } from '@modules/kitchen/presentation/http/endpoints/simulate-kitchen.endpoint';
import { SimulateKitchenController } from '@modules/kitchen/presentation/controllers/simulate-kitchen.controller';
import { I18nService } from '@modules/i18n/application/i18n.service';

describe('SimulateKitchenEndpoint', () => {
  let endpoint: SimulateKitchenEndpoint;
  let controller: jest.Mocked<SimulateKitchenController>;
  let i18n: jest.Mocked<I18nService>;

  beforeEach(async () => {
    controller = { handle: jest.fn() } as any;
    i18n = { translate: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulateKitchenEndpoint,
        { provide: SimulateKitchenController, useValue: controller },
        { provide: I18nService, useValue: i18n },
      ],
    }).compile();

    endpoint = module.get(SimulateKitchenEndpoint);
  });

  it('should return started message with localized translation', () => {
    i18n.translate.mockReturnValue('Kitchen simulation started');

    const res = endpoint.handle({ locale: 'en' });

    expect(res.success).toBe(true);
    expect(res.message).toBe('Kitchen simulation started');
    expect(controller.handle).toHaveBeenCalledWith({});
    expect(i18n.translate).toHaveBeenCalledWith(
      'kitchen_simulation_started',
      {},
      'en',
    );
  });
});
