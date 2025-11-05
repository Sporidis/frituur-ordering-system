import { Test, TestingModule } from '@nestjs/testing';
import { SimulateKitchenUseCase } from '@modules/kitchen/application/use-cases/simulate-kitchen.usecase';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '@modules/order/domain/repositories/order.repository';
import { OrderStatus } from '@modules/order/domain';

describe('SimulateKitchenUseCase', () => {
  let useCase: SimulateKitchenUseCase;
  let orderRepository: jest.Mocked<OrderRepository>;

  beforeEach(async () => {
    const mockOrderRepository = {
      getAllOrders: jest.fn(),
      updateOrderStatus: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulateKitchenUseCase,
        { provide: ORDER_REPOSITORY, useValue: mockOrderRepository },
      ],
    }).compile();

    useCase = module.get<SimulateKitchenUseCase>(SimulateKitchenUseCase);
    orderRepository = module.get(ORDER_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should execute simulation workflow with pending orders', () => {
    orderRepository.getAllOrders.mockReturnValue([
      {
        id: '#001',
        customerName: 'Test',
        items: [],
        totalAmount: 10,
        status: OrderStatus.PENDING,
        estimatedReadyTime: new Date(),
        createdAt: new Date(),
      },
    ] as any);
    orderRepository.updateOrderStatus.mockReturnValue(true);

    const request = {};
    const result = useCase.execute(request);

    expect(result.message).toBe('Simulation started');
    expect(orderRepository.getAllOrders).toHaveBeenCalled();
    expect(orderRepository.updateOrderStatus).toHaveBeenCalledWith(
      '#001',
      OrderStatus.IN_PROGRESS,
      'kitchen_started_preparing',
    );
  });
});
