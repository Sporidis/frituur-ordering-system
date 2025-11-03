import { Test, TestingModule } from '@nestjs/testing';
import { GetStatsOverviewHttpController } from '@modules/ordering/presentation/http/controllers/get-stats-overview.http.controller';
import { GetStatsOverviewEndpoint } from '@modules/ordering/presentation/http/endpoints/get-stats-overview.endpoint';

describe('GetStatsOverviewHttpController', () => {
  let controller: GetStatsOverviewHttpController;
  let endpoint: jest.Mocked<GetStatsOverviewEndpoint>;

  beforeEach(async () => {
    endpoint = { handle: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStatsOverviewHttpController,
        { provide: GetStatsOverviewEndpoint, useValue: endpoint },
      ],
    }).compile();

    controller = module.get(GetStatsOverviewHttpController);
  });

  it('should call endpoint with locale', () => {
    endpoint.handle.mockReturnValue({
      success: true,
      stats: {} as any,
      connectedClients: {},
      totalConnectedClients: 0,
    });

    controller.handle('en');

    expect(endpoint.handle).toHaveBeenCalledWith({ locale: 'en' });
  });
});
