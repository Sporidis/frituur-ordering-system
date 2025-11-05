import { CatalogHttpController } from '@modules/catalog/presentation/http/controllers/catalog.http.controller';
import { GetCategoriesEndpoint } from '@modules/catalog/presentation/http/endpoints/get-categories.endpoint';
import { GetMenuItemsEndpoint } from '@modules/catalog/presentation/http/endpoints/get-menu-items.endpoint';

describe('CatalogHttpController', () => {
  let controller: CatalogHttpController;
  let getCategoriesEndpoint: jest.Mocked<GetCategoriesEndpoint>;
  let getMenuItemsEndpoint: jest.Mocked<GetMenuItemsEndpoint>;

  beforeEach(() => {
    getCategoriesEndpoint = {
      handle: jest.fn(),
    } as any;
    getMenuItemsEndpoint = {
      handle: jest.fn(),
    } as any;
    controller = new CatalogHttpController(
      getCategoriesEndpoint,
      getMenuItemsEndpoint,
    );
  });

  it('should return categories with success=true', () => {
    getCategoriesEndpoint.handle.mockReturnValue({
      success: true,
      categories: [{ id: 'cat1', name: 'Fries', displayOrder: 1 }],
      count: 1,
    });

    const res = controller.categories('en');

    expect(res.success).toBe(true);
    expect(res.categories.length).toBe(1);
    expect(getCategoriesEndpoint.handle).toHaveBeenCalledWith({ locale: 'en' });
  });

  it('should return items filtered by category when provided', () => {
    getMenuItemsEndpoint.handle.mockReturnValue({
      success: true,
      items: [
        {
          id: 'i1',
          categoryId: 'cat1',
          name: 'Item 1',
          price: 5.0,
          preparationTimeMinutes: 10,
          allergens: [],
          isAvailable: true,
        },
      ],
      count: 1,
    });

    const res = controller.items('nl', 'cat1');

    expect(res.success).toBe(true);
    expect(res.items[0].categoryId).toBe('cat1');
    expect(getMenuItemsEndpoint.handle).toHaveBeenCalledWith({
      locale: 'nl',
      categoryId: 'cat1',
    });
  });
});
