import {
  Category,
  CategoryTranslation,
  MenuItem,
  MenuItemTranslation,
} from '../../domain/models';
import type { CatalogRepository } from '../../domain/repositories/catalog.repository';

export class InMemoryCatalogRepository implements CatalogRepository {
  private readonly categories: Category[] = [
    { id: 'cat_frieten', displayOrder: 1, createdAt: new Date() },
    { id: 'cat_snacks', displayOrder: 2, createdAt: new Date() },
    { id: 'cat_drinks', displayOrder: 3, createdAt: new Date() },
  ];

  private readonly categoryTranslations: CategoryTranslation[] = [
    {
      id: 'ct_en_frieten',
      categoryId: 'cat_frieten',
      languageCode: 'en',
      name: 'Fries',
      description: 'Crispy fries',
      createdAt: new Date(),
    },
    {
      id: 'ct_nl_frieten',
      categoryId: 'cat_frieten',
      languageCode: 'nl',
      name: 'Frieten',
      description: 'Krokante frietjes',
      createdAt: new Date(),
    },
    {
      id: 'ct_en_snacks',
      categoryId: 'cat_snacks',
      languageCode: 'en',
      name: 'Snacks',
      description: 'Quick bites',
      createdAt: new Date(),
    },
    {
      id: 'ct_nl_snacks',
      categoryId: 'cat_snacks',
      languageCode: 'nl',
      name: 'Snacks',
      description: 'Snacks',
      createdAt: new Date(),
    },
    {
      id: 'ct_en_drinks',
      categoryId: 'cat_drinks',
      languageCode: 'en',
      name: 'Drinks',
      description: 'Cold drinks',
      createdAt: new Date(),
    },
    {
      id: 'ct_nl_drinks',
      categoryId: 'cat_drinks',
      languageCode: 'nl',
      name: 'Dranken',
      description: 'Koude dranken',
      createdAt: new Date(),
    },
  ];

  private readonly menuItems: MenuItem[] = [
    {
      id: 'mi_small_fries',
      categoryId: 'cat_frieten',
      basePrice: 2.5,
      preparationTimeMinutes: 3,
      allergens: [],
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      id: 'mi_large_fries',
      categoryId: 'cat_frieten',
      basePrice: 3.5,
      preparationTimeMinutes: 4,
      allergens: [],
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      id: 'mi_bitterballen',
      categoryId: 'cat_snacks',
      basePrice: 4.0,
      preparationTimeMinutes: 6,
      allergens: ['gluten'],
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      id: 'mi_frikandel',
      categoryId: 'cat_snacks',
      basePrice: 2.8,
      preparationTimeMinutes: 5,
      allergens: ['gluten'],
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      id: 'mi_cola',
      categoryId: 'cat_drinks',
      basePrice: 2.2,
      preparationTimeMinutes: 0,
      allergens: [],
      isAvailable: true,
      createdAt: new Date(),
    },
  ];

  private readonly menuItemTranslations: MenuItemTranslation[] = [
    {
      id: 'mit_en_small_fries',
      menuItemId: 'mi_small_fries',
      languageCode: 'en',
      name: 'Small Fries',
      description: 'Small portion of fries',
      createdAt: new Date(),
    },
    {
      id: 'mit_nl_small_fries',
      menuItemId: 'mi_small_fries',
      languageCode: 'nl',
      name: 'Kleine Frieten',
      description: 'Kleine portie frieten',
      createdAt: new Date(),
    },
    {
      id: 'mit_en_large_fries',
      menuItemId: 'mi_large_fries',
      languageCode: 'en',
      name: 'Large Fries',
      description: 'Large portion of fries',
      createdAt: new Date(),
    },
    {
      id: 'mit_nl_large_fries',
      menuItemId: 'mi_large_fries',
      languageCode: 'nl',
      name: 'Grote Frieten',
      description: 'Grote portie frieten',
      createdAt: new Date(),
    },
    {
      id: 'mit_en_bitterballen',
      menuItemId: 'mi_bitterballen',
      languageCode: 'en',
      name: 'Bitterballen (6)',
      description: 'Six bitterballen',
      createdAt: new Date(),
    },
    {
      id: 'mit_nl_bitterballen',
      menuItemId: 'mi_bitterballen',
      languageCode: 'nl',
      name: 'Bitterballen (6)',
      description: 'Zes bitterballen',
      createdAt: new Date(),
    },
    {
      id: 'mit_en_frikandel',
      menuItemId: 'mi_frikandel',
      languageCode: 'en',
      name: 'Frikandel',
      description: 'Frikandel',
      createdAt: new Date(),
    },
    {
      id: 'mit_nl_frikandel',
      menuItemId: 'mi_frikandel',
      languageCode: 'nl',
      name: 'Frikandel',
      description: 'Frikandel',
      createdAt: new Date(),
    },
    {
      id: 'mit_en_cola',
      menuItemId: 'mi_cola',
      languageCode: 'en',
      name: 'Cola',
      description: 'Cola drink',
      createdAt: new Date(),
    },
    {
      id: 'mit_nl_cola',
      menuItemId: 'mi_cola',
      languageCode: 'nl',
      name: 'Cola',
      description: 'Cola drank',
      createdAt: new Date(),
    },
  ];
  getCategories(): Category[] {
    return this.categories;
  }

  getCategoryTranslations(): CategoryTranslation[] {
    return this.categoryTranslations;
  }

  getMenuItems(): MenuItem[] {
    return this.menuItems;
  }

  getMenuItemTranslations(): MenuItemTranslation[] {
    return this.menuItemTranslations;
  }
}
