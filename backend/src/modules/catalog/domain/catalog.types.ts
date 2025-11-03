export interface Category {
  id: string;
  name: string;
  nameKey?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  nameKey?: string;
  price: number;
  categoryId: string;
}
