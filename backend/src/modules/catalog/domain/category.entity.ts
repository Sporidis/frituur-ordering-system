import { Category, CategoryTranslation, LocalizedCategory } from './models';

export class CategoryEntity implements Category {
  id: string;
  displayOrder: number;
  createdAt: Date;
  nameKey?: string;
  descriptionKey?: string;

  constructor(data: Category) {
    this.id = data.id;
    this.displayOrder = data.displayOrder;
    this.createdAt = data.createdAt;
    this.nameKey = data.nameKey;
    this.descriptionKey = data.descriptionKey;
  }

  /**
   * Sort categories by display order
   */
  static sortByDisplayOrder(categories: Category[]): Category[] {
    return [...categories].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /**
   * Localize a category with translations
   */
  localize(translations: CategoryTranslation[]): LocalizedCategory {
    const translation = translations.find((t) => t.categoryId === this.id);
    return {
      id: this.id,
      name: translation?.name ?? this.id,
      description: translation?.description,
      displayOrder: this.displayOrder,
    };
  }

  /**
   * Localize multiple categories with translations
   */
  static localizeCategories(
    categories: Category[],
    translations: CategoryTranslation[],
  ): LocalizedCategory[] {
    const translationMap = new Map(translations.map((t) => [t.categoryId, t]));
    return categories.map((category) => {
      const translation = translationMap.get(category.id);
      return {
        id: category.id,
        name: translation?.name ?? category.id,
        description: translation?.description,
        displayOrder: category.displayOrder,
      };
    });
  }
}
