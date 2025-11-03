import { InMemoryCatalogRepository } from '@modules/catalog/infrastructure/inmemory/catalog.repository';

describe('InMemoryCatalogRepository', () => {
  let repo: InMemoryCatalogRepository;

  beforeEach(() => {
    repo = new InMemoryCatalogRepository();
  });

  it('should return categories', () => {
    const categories = repo.getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty('id');
    expect(categories[0]).toHaveProperty('displayOrder');
  });

  it('should return category translations', () => {
    const translations = repo.getCategoryTranslations();
    expect(translations.length).toBeGreaterThan(0);
    expect(translations[0]).toHaveProperty('categoryId');
    expect(translations[0]).toHaveProperty('languageCode');
    expect(translations[0]).toHaveProperty('name');
  });

  it('should return menu items', () => {
    const items = repo.getMenuItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveProperty('id');
    expect(items[0]).toHaveProperty('categoryId');
    expect(items[0]).toHaveProperty('basePrice');
  });

  it('should return menu item translations', () => {
    const translations = repo.getMenuItemTranslations();
    expect(translations.length).toBeGreaterThan(0);
    expect(translations[0]).toHaveProperty('menuItemId');
    expect(translations[0]).toHaveProperty('languageCode');
    expect(translations[0]).toHaveProperty('name');
  });
});
