export type HttpOk<T> = { success: true } & T;
export type HttpFail = { success: false; message: string };

export const OrderPresenters = {
  created: (order: any): HttpOk<{ order: any; message: string }> => ({
    success: true,
    order,
    message: 'Order created successfully',
  }),
  single: (order: any): HttpOk<{ order: any }> => ({ success: true, order }),
  list: (orders: any[]): HttpOk<{ orders: any[]; count: number }> => ({
    success: true,
    orders,
    count: orders.length,
  }),
  updated: (): HttpOk<{ message: string }> => ({
    success: true,
    message: 'Order status updated successfully',
  }),
  overview: (params: {
    stats: any;
    connectedClients: Record<string, number>;
    totalConnectedClients: number;
  }): HttpOk<{
    stats: any;
    connectedClients: Record<string, number>;
    totalConnectedClients: number;
  }> => ({
    success: true,
    stats: params.stats,
    connectedClients: params.connectedClients,
    totalConnectedClients: params.totalConnectedClients,
  }),
  started: (message: string): HttpOk<{ message: string }> => ({
    success: true,
    message,
  }),
  error: (message: string): HttpFail => ({ success: false, message }),
};
