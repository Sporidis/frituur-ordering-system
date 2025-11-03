import { Test, TestingModule } from '@nestjs/testing';
import { GetStatsOverviewEndpoint } from '@modules/ordering/presentation/http/endpoints/get-stats-overview.endpoint';
import { GetStatsOverviewController } from '@modules/ordering/presentation/controllers/get-stats-overview.controller';
import { I18nService } from '@modules/i18n/application/i18n.service';

describe('GetStatsOverviewEndpoint', () => {
  let endpoint: GetStatsOverviewEndpoint;
  let controller: jest.Mocked<GetStatsOverviewController>;
  let i18n: jest.Mocked<I18nService>;

  beforeEach(async () => {
    controller = { handle: jest.fn() } as any;
    i18n = { translate: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStatsOverviewEndpoint,
        { provide: GetStatsOverviewController, useValue: controller },
        { provide: I18nService, useValue: i18n },
      ],
    }).compile();

    endpoint = module.get(GetStatsOverviewEndpoint);
  });

  it('should return overview with localized title', () => {
    controller.handle.mockReturnValue({
      stats: { totalOrders: 5 },
      connectedClients: {},
      totalConnectedClients: 0,
    });
    i18n.translate.mockReturnValue('Overview');

    const res = endpoint.handle({ locale: 'en' });

    expect(res.success).toBe(true);
    expect(res.stats.totalOrders).toBe(5);
    expect(res.title).toBe('Overview');
    expect(i18n.translate).toHaveBeenCalledWith(
      'orders_overview_title',
      {},
      'en',
    );
  });
});
