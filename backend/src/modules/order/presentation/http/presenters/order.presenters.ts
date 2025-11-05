export type HttpOk<T> = { success: true } & T;
export type HttpFail = { success: false; message: string };

import type { OrderView } from '../types';

export const OrderPresenters = {
  created: (
    order: OrderView,
    message: string,
  ): HttpOk<{ order: OrderView; message: string }> => ({
    success: true,
    order,
    message,
  }),
  single: (
    order: OrderView,
    title?: string,
  ): HttpOk<{ order: OrderView; title?: string }> => ({
    success: true,
    order,
    ...(title ? { title } : {}),
  }),
  list: (
    orders: OrderView[],
    title?: string,
  ): HttpOk<{ orders: OrderView[]; count: number; title?: string }> => ({
    success: true,
    orders,
    count: orders.length,
    ...(title ? { title } : {}),
  }),
  updated: (message: string): HttpOk<{ message: string }> => ({
    success: true,
    message,
  }),
  overview: (params: {
    stats: any;
    connectedClients: Record<string, number>;
    totalConnectedClients: number;
    title?: string;
  }): HttpOk<{
    stats: any;
    connectedClients: Record<string, number>;
    totalConnectedClients: number;
    title?: string;
  }> => ({
    success: true,
    stats: params.stats,
    connectedClients: params.connectedClients,
    totalConnectedClients: params.totalConnectedClients,
    ...(params.title ? { title: params.title } : {}),
  }),
  started: (message: string): HttpOk<{ message: string }> => ({
    success: true,
    message,
  }),
  error: (message: string): HttpFail => ({ success: false, message }),
};
