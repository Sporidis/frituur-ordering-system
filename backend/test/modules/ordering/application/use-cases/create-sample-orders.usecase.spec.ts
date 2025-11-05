import { Test, TestingModule } from '@nestjs/testing';
import { CreateSampleOrdersUseCase } from '@modules/order/application/use-cases/create-sample-orders.usecase';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';

describe('CreateSampleOrdersUseCase', () => {
  let useCase: CreateSampleOrdersUseCase;
  let repo: any;

  beforeEach(async () => {
    repo = {
      createOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSampleOrdersUseCase,
        { provide: ORDER_REPOSITORY, useValue: repo },
      ],
    }).compile();

    useCase = module.get(CreateSampleOrdersUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create two sample orders', () => {
    const res = useCase.execute({});

    expect(repo.createOrder).toHaveBeenCalledTimes(2);
    expect(res.message).toBe('Sample orders created');
  });
});
