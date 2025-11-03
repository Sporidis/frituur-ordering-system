import { CreateOrderHttpController } from './create-order.http.controller';
import { GetOrderHttpController } from './get-order.http.controller';
import { GetAllOrdersHttpController } from './get-all-orders.http.controller';
import { UpdateOrderStatusHttpController } from './update-order-status.http.controller';
import { GetStatsOverviewHttpController } from './get-stats-overview.http.controller';
import { CreateSampleOrdersHttpController } from './create-sample-orders.http.controller';

export const ORDER_NEST_CONTROLLERS = [
  CreateOrderHttpController,
  GetOrderHttpController,
  GetAllOrdersHttpController,
  UpdateOrderStatusHttpController,
  GetStatsOverviewHttpController,
  CreateSampleOrdersHttpController,
];

export {
  CreateOrderHttpController,
  GetOrderHttpController,
  GetAllOrdersHttpController,
  UpdateOrderStatusHttpController,
  GetStatsOverviewHttpController,
  CreateSampleOrdersHttpController,
};
