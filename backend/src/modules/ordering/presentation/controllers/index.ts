import { CreateOrderController } from './create-order.controller';
import { GetOrderController } from './get-order.controller';
import { GetAllOrdersController } from './get-all-orders.controller';
import { UpdateOrderStatusController } from './update-order-status.controller';
import { GetStatsOverviewController } from './get-stats-overview.controller';
import { CreateSampleOrdersController } from './create-sample-orders.controller';

export const ORDER_HTTP_CONTROLLERS = [
  CreateOrderController,
  GetOrderController,
  GetAllOrdersController,
  UpdateOrderStatusController,
  GetStatsOverviewController,
  CreateSampleOrdersController,
];

export {
  CreateOrderController,
  GetOrderController,
  GetAllOrdersController,
  UpdateOrderStatusController,
  GetStatsOverviewController,
  CreateSampleOrdersController,
};
