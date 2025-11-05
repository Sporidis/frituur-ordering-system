import type {
  LocalizedCategory,
  LocalizedMenuItem,
} from '../../../domain/models';

export type HttpOk<T> = { success: true } & T;
export type HttpFail = { success: false; message: string };

export const CatalogPresenters = {
  categories: (
    categories: LocalizedCategory[],
    title?: string,
  ): HttpOk<{
    categories: LocalizedCategory[];
    count: number;
    title?: string;
  }> => ({
    success: true,
    categories,
    count: categories.length,
    ...(title ? { title } : {}),
  }),

  items: (
    items: LocalizedMenuItem[],
    title?: string,
  ): HttpOk<{ items: LocalizedMenuItem[]; count: number; title?: string }> => ({
    success: true,
    items,
    count: items.length,
    ...(title ? { title } : {}),
  }),

  error: (message: string): HttpFail => ({ success: false, message }),
};
