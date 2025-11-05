import { MenuItem, MenuItemTranslation, LocalizedMenuItem } from './models';

export class MenuItemEntity implements MenuItem {
  id: string;
  categoryId: string;
  basePrice: number;
  preparationTimeMinutes: number;
  allergens: string[];
  isAvailable: boolean;
  createdAt: Date;
  nameKey?: string;
  descriptionKey?: string;

  constructor(data: MenuItem) {
    this.id = data.id;
    this.categoryId = data.categoryId;
    this.basePrice = data.basePrice;
    this.preparationTimeMinutes = data.preparationTimeMinutes;
    this.allergens = data.allergens;
    this.isAvailable = data.isAvailable;
    this.createdAt = data.createdAt;
    this.nameKey = data.nameKey;
    this.descriptionKey = data.descriptionKey;
  }

  /**
   * Filter menu items by category
   */
  static filterByCategory(items: MenuItem[], categoryId?: string): MenuItem[] {
    if (!categoryId) {
      return items;
    }
    return items.filter((item) => item.categoryId === categoryId);
  }

  /**
   * Localize a menu item with translations
   */
  localize(translations: MenuItemTranslation[]): LocalizedMenuItem {
    const translation = translations.find((t) => t.menuItemId === this.id);
    return {
      id: this.id,
      categoryId: this.categoryId,
      name: translation?.name ?? this.id,
      description: translation?.description,
      price: this.basePrice,
      preparationTimeMinutes: this.preparationTimeMinutes,
      allergens: this.allergens,
      isAvailable: this.isAvailable,
    };
  }

  /**
   * Localize multiple menu items with translations
   */
  static localizeMenuItems(
    items: MenuItem[],
    translations: MenuItemTranslation[],
    categoryId?: string,
  ): LocalizedMenuItem[] {
    const filteredItems = MenuItemEntity.filterByCategory(items, categoryId);
    const translationMap = new Map(translations.map((t) => [t.menuItemId, t]));
    return filteredItems.map((item) => {
      const translation = translationMap.get(item.id);
      return {
        id: item.id,
        categoryId: item.categoryId,
        name: translation?.name ?? item.id,
        description: translation?.description,
        price: item.basePrice,
        preparationTimeMinutes: item.preparationTimeMinutes,
        allergens: item.allergens,
        isAvailable: item.isAvailable,
      };
    });
  }
}
