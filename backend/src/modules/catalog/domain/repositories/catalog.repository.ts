import type {
  Category,
  CategoryTranslation,
  MenuItem,
  MenuItemTranslation,
} from '../../domain/models';

export interface CatalogRepository {
  getCategories(): Category[];
  getCategoryTranslations(): CategoryTranslation[];
  getMenuItems(): MenuItem[];
  getMenuItemTranslations(): MenuItemTranslation[];
}

export const CATALOG_REPOSITORY = 'CATALOG_REPOSITORY';
