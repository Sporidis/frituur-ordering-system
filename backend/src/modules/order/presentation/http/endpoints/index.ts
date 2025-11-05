import { CreateOrderEndpoint } from './create-order.endpoint';
import { CreateSampleOrdersEndpoint } from './create-sample-orders.endpoint';
import { GetAllOrdersEndpoint } from './get-all-orders.endpoint';
import { GetOrderEndpoint } from './get-order.endpoint';
import { GetStatsOverviewEndpoint } from './get-stats-overview.endpoint';
import { UpdateOrderStatusEndpoint } from './update-order-status.endpoint';
import { QuoteOrderEndpoint } from './quote-order.endpoint';

export const ORDER_HTTP_ENDPOINTS = [
  CreateOrderEndpoint,
  GetOrderEndpoint,
  GetAllOrdersEndpoint,
  UpdateOrderStatusEndpoint,
  GetStatsOverviewEndpoint,
  CreateSampleOrdersEndpoint,
  QuoteOrderEndpoint,
];

export {
  CreateOrderEndpoint,
  GetOrderEndpoint,
  GetAllOrdersEndpoint,
  UpdateOrderStatusEndpoint,
  GetStatsOverviewEndpoint,
  CreateSampleOrdersEndpoint,
  QuoteOrderEndpoint,
};
