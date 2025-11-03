import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderUseCase } from '@modules/ordering/application/use-cases/create-order.usecase';
import { OrderService } from '@modules/ordering/order.service';
import {
  PRICING_PORT,
  type PricingPort,
} from '@modules/pricing/domain/ports/pricing.port';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let orderService: jest.Mocked<OrderService>;
  let pricingPort: jest.Mocked<PricingPort>;

  beforeEach(async () => {
    const mockOrderService = {
      createOrder: jest.fn(),
    } as any;

    const mockPricing = {
      quote: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderUseCase,
        { provide: OrderService, useValue: mockOrderService },
        { provide: PRICING_PORT, useValue: mockPricing },
      ],
    }).compile();

    useCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
    orderService = module.get(OrderService);
    pricingPort = module.get(PRICING_PORT);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create an order with pricing calculated', async () => {
    const mockPriceBreakdown = {
      subtotal: 10.5,
      tax: 0.63,
      total: 11.13,
    };

    pricingPort.quote.mockReturnValue(mockPriceBreakdown);
    orderService.createOrder.mockReturnValue({
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
    expect(result.totalAmount).toBe(11.13);
    expect(pricingPort.quote).toHaveBeenCalled();
    expect(orderService.createOrder).toHaveBeenCalledWith(
      'John Doe',
      request.items,
      11.13,
    );
  });
});
