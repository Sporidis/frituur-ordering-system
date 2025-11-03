import { Test, TestingModule } from '@nestjs/testing';
import { SimulateKitchenUseCase } from '@modules/kitchen/application/use-cases/simulate-kitchen.usecase';
import { OrderService } from '@modules/ordering/order.service';

describe('SimulateKitchenUseCase', () => {
  let useCase: SimulateKitchenUseCase;
  let orderService: jest.Mocked<OrderService>;

  beforeEach(async () => {
    const mockOrderService = {
      simulateKitchenWorkflow: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulateKitchenUseCase,
        { provide: OrderService, useValue: mockOrderService },
      ],
    }).compile();

    useCase = module.get<SimulateKitchenUseCase>(SimulateKitchenUseCase);
    orderService = module.get(OrderService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should execute simulation workflow', () => {
    const request = {};
    const result = useCase.execute(request);

    expect(result.message).toBe('Simulation started');
    expect(orderService.simulateKitchenWorkflow).toHaveBeenCalled();
  });
});
