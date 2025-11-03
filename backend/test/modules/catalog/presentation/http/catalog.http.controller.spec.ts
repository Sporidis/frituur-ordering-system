import { CatalogHttpController } from '@modules/catalog/presentation/http/controllers/catalog.http.controller';
import { CatalogQueryService } from '@modules/catalog/application/catalog.query.service';

describe('CatalogHttpController', () => {
  let controller: CatalogHttpController;
  let queries: jest.Mocked<CatalogQueryService>;

  beforeEach(() => {
    queries = {
      getCategories: jest.fn(),
      getItems: jest.fn(),
    } as any;
    controller = new CatalogHttpController(queries);
  });

  it('should return categories with success=true', () => {
    queries.getCategories.mockReturnValue([
      { id: 'cat1', name: 'Fries' },
    ] as any);

    const res = controller.categories('en');

    expect(res.success).toBe(true);
    expect(res.categories.length).toBe(1);
    expect(queries.getCategories).toHaveBeenCalledWith('en');
  });

  it('should return items filtered by category when provided', () => {
    queries.getItems.mockReturnValue([{ id: 'i1', categoryId: 'cat1' }] as any);

    const res = controller.items('nl', 'cat1');

    expect(res.success).toBe(true);
    expect(res.items[0].categoryId).toBe('cat1');
    expect(queries.getItems).toHaveBeenCalledWith('nl', 'cat1');
  });
});
