import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderUseCase } from '@modules/order/application/use-cases/create-order.usecase';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';
import type { OrderRepository } from '@modules/order/domain/repositories/order.repository';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let orderRepository: jest.Mocked<OrderRepository>;

  beforeEach(async () => {
    const mockOrderRepository = {
      createOrder: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderUseCase,
        { provide: ORDER_REPOSITORY, useValue: mockOrderRepository },
      ],
    }).compile();

    useCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
    orderRepository = module.get(ORDER_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create an order with pricing calculated', async () => {
    orderRepository.createOrder.mockReturnValue({
      id: '#001',
      customerName: 'John Doe',
      items: [],
      totalAmount: 11.13,
      status: 'pending',
      estimatedReadyTime: new Date(),
      createdAt: new Date(),
    } as any);

    const request = {
      customerName: 'John Doe',
      items: [
        { name: 'Fries', price: 3, quantity: 2 },
        { name: 'Burger', price: 4.5, quantity: 1 },
      ],
    };

    const result = await useCase.execute(request);

    expect(result.id).toBe('#001');
    // calculateTotalWithTax: (3*2 + 4.5*1) = 10.5, tax = 0.63, total = 11.13
    expect(result.totalAmount).toBe(11.13);
    expect(orderRepository.createOrder).toHaveBeenCalledWith(
      'John Doe',
      request.items,
      11.13,
    );
  });
});
