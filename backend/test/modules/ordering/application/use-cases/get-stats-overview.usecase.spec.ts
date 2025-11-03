import { Test, TestingModule } from '@nestjs/testing';
import { GetStatsOverviewUseCase } from '@modules/ordering/application/use-cases/get-stats-overview.usecase';
import { ORDER_REPOSITORY } from '@modules/ordering/domain/repositories/order.repository';

describe('GetStatsOverviewUseCase', () => {
  let useCase: GetStatsOverviewUseCase;
  let repo: any;

  beforeEach(async () => {
    repo = {
      getOrderStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStatsOverviewUseCase,
        { provide: ORDER_REPOSITORY, useValue: repo },
      ],
    }).compile();

    useCase = module.get(GetStatsOverviewUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return overview with stats', () => {
    const stats = { totalOrders: 5, pending: 2, ready: 1, completed: 2 } as any;
    repo.getOrderStats.mockReturnValue(stats);

    const res = useCase.execute();

    expect(res.stats).toBe(stats);
    expect(res.totalConnectedClients).toBe(0);
    expect(res.connectedClients).toEqual({});
  });
});
