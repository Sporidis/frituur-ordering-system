import { GetCategoriesEndpoint } from './get-categories.endpoint';
import { GetMenuItemsEndpoint } from './get-menu-items.endpoint';

export const CATALOG_HTTP_ENDPOINTS = [
  GetCategoriesEndpoint,
  GetMenuItemsEndpoint,
];

export { GetCategoriesEndpoint, GetMenuItemsEndpoint };
