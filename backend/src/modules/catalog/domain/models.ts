export interface Category {
  id: string; // uuid
  displayOrder: number;
  createdAt: Date;
  nameKey?: string;
  descriptionKey?: string;
}

export interface CategoryTranslation {
  id: string; // uuid
  categoryId: string;
  languageCode: string; // en, nl, fr, ...
  name: string;
  description?: string;
  createdAt: Date;
}

export interface MenuItem {
  id: string; // uuid
  categoryId: string;
  basePrice: number; // decimal
  preparationTimeMinutes: number; // int
  allergens: string[]; // array
  isAvailable: boolean; // boolean
  createdAt: Date;
  nameKey?: string;
  descriptionKey?: string;
}

export interface MenuItemTranslation {
  id: string; // uuid
  menuItemId: string;
  languageCode: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface LocalizedCategory {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
}

export interface LocalizedMenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  preparationTimeMinutes: number;
  allergens: string[];
  isAvailable: boolean;
}
