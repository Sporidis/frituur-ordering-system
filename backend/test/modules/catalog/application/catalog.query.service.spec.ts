import { Test, TestingModule } from '@nestjs/testing';
import { CatalogQueryService } from '@modules/catalog/application/catalog.query.service';
import {
  CATALOG_REPOSITORY,
  type CatalogRepository,
} from '@modules/catalog/domain/repositories/catalog.repository';

describe('CatalogQueryService', () => {
  let service: CatalogQueryService;
  let catalogRepository: jest.Mocked<CatalogRepository>;

  beforeEach(async () => {
    const mockRepository = {
      getCategories: jest.fn(),
      getCategoryTranslations: jest.fn(),
      getMenuItems: jest.fn(),
      getMenuItemTranslations: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogQueryService,
        { provide: CATALOG_REPOSITORY, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<CatalogQueryService>(CatalogQueryService);
    catalogRepository = module.get(CATALOG_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get localized categories', () => {
    const mockCategories = [
      {
        id: 'cat1',
        displayOrder: 1,
      },
    ];

    catalogRepository.getCategories.mockReturnValue(mockCategories as any);
    catalogRepository.getCategoryTranslations.mockReturnValue([
      {
        id: 'trans1',
        categoryId: 'cat1',
        languageCode: 'en',
        name: 'Fries',
        createdAt: new Date(),
      },
    ]);

    const result = service.getCategories('en');

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(catalogRepository.getCategories).toHaveBeenCalled();
  });
});
