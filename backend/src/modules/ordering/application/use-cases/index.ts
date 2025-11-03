export { CreateSampleOrdersUseCase } from './create-sample-orders.usecase';
export { CreateOrderUseCase } from './create-order.usecase';
export { UpdateOrderStatusUseCase } from './update-order-status.usecase';
export { GetOrderUseCase } from './get-order.usecase';
export { GetAllOrdersUseCase } from './get-all-orders.usecase';
export { GetStatsOverviewUseCase } from './get-stats-overview.usecase';

import { CreateOrderUseCase } from './create-order.usecase';
import { UpdateOrderStatusUseCase } from './update-order-status.usecase';
import { GetOrderUseCase } from './get-order.usecase';
import { GetAllOrdersUseCase } from './get-all-orders.usecase';
import { GetStatsOverviewUseCase } from './get-stats-overview.usecase';
import { CreateSampleOrdersUseCase } from './create-sample-orders.usecase';

export const ORDER_USE_CASES = [
  CreateOrderUseCase,
  UpdateOrderStatusUseCase,
  GetOrderUseCase,
  GetAllOrdersUseCase,
  GetStatsOverviewUseCase,
  CreateSampleOrdersUseCase,
];
