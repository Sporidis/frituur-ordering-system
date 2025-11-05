import type {
  Category,
  CategoryTranslation,
  MenuItem,
  MenuItemTranslation,
} from '../../domain/models';

export interface CatalogRepository {
  getCategories(): Promise<Category[]>;
  getCategoryTranslations(): Promise<CategoryTranslation[]>;
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemTranslations(): Promise<MenuItemTranslation[]>;
}

export const CATALOG_REPOSITORY = 'CATALOG_REPOSITORY';
