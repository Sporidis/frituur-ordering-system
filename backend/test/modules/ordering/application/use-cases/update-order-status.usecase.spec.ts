import { Test, TestingModule } from '@nestjs/testing';
import { UpdateOrderStatusUseCase } from '@modules/order/application/use-cases/update-order-status.usecase';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';
import { OrderStatus } from '@modules/order/domain/order.types';

describe('UpdateOrderStatusUseCase', () => {
  let useCase: UpdateOrderStatusUseCase;
  let repo: any;

  beforeEach(async () => {
    repo = {
      updateOrderStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateOrderStatusUseCase,
        { provide: ORDER_REPOSITORY, useValue: repo },
      ],
    }).compile();

    useCase = module.get(UpdateOrderStatusUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should update status', () => {
    repo.updateOrderStatus.mockReturnValue(true);

    const res = useCase.execute({ id: 'o1', status: OrderStatus.READY });

    expect(res.success).toBe(true);
    expect(repo.updateOrderStatus).toHaveBeenCalledWith(
      'o1',
      OrderStatus.READY,
    );
  });
});
