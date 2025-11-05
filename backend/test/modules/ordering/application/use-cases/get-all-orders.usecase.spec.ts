import { Test, TestingModule } from '@nestjs/testing';
import { GetAllOrdersUseCase } from '@modules/order/application/use-cases/get-all-orders.usecase';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';

describe('GetAllOrdersUseCase', () => {
  let useCase: GetAllOrdersUseCase;
  let repo: any;

  beforeEach(async () => {
    repo = {
      getAllOrders: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllOrdersUseCase,
        { provide: ORDER_REPOSITORY, useValue: repo },
      ],
    }).compile();

    useCase = module.get(GetAllOrdersUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return all orders', () => {
    const orders = [{ id: 'o1' }, { id: 'o2' }] as any;
    repo.getAllOrders.mockReturnValue(orders);

    const res = useCase.execute({});

    expect(res.orders).toBe(orders);
    expect(repo.getAllOrders).toHaveBeenCalled();
  });
});
