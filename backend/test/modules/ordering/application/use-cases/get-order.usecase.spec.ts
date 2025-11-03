import { Test, TestingModule } from '@nestjs/testing';
import { GetOrderUseCase } from '@modules/ordering/application/use-cases/get-order.usecase';
import { ORDER_REPOSITORY } from '@modules/ordering/domain/repositories/order.repository';

describe('GetOrderUseCase', () => {
  let useCase: GetOrderUseCase;
  let repo: any;

  beforeEach(async () => {
    repo = {
      getOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOrderUseCase,
        { provide: ORDER_REPOSITORY, useValue: repo },
      ],
    }).compile();

    useCase = module.get(GetOrderUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return order by id', () => {
    const order = { id: 'o1' } as any;
    repo.getOrder.mockReturnValue(order);

    const res = useCase.execute({ id: 'o1' });

    expect(res.order).toBe(order);
    expect(repo.getOrder).toHaveBeenCalledWith('o1');
  });
});
