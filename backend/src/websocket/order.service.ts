import { Injectable, Logger } from '@nestjs/common';
import { OrderGateway, Order, OrderStatus, OrderItem } from './order.gateway';

@Injectable()
export class OrderService {
  private logger: Logger = new Logger('OrderService');
  private orders: Map<string, Order> = new Map();
  private orderCounter = 1;

  constructor(private orderGateway: OrderGateway) {}

  // Create a new order
  createOrder(customerName: string, items: Omit<OrderItem, 'id'>[]): Order {
    const orderId = `#${this.orderCounter.toString().padStart(3, '0')}`;
    this.orderCounter++;
    const now = new Date();

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Estimate ready time (simple algorithm: 5 minutes base + 2 minutes per item)
    const estimatedReadyTime = new Date(
      now.getTime() + (5 + items.length * 2) * 60000,
    );

    const order: Order = {
      id: orderId,
      customerName,
      items: items.map((item, index) => ({
        id: `item_${orderId}_${index}`,
        ...item,
      })),
      totalAmount,
      status: OrderStatus.PENDING,
      estimatedReadyTime,
      createdAt: now,
    };

    this.orders.set(orderId, order);
    this.logger.log(`Created new order: ${orderId}`, order);

    // Emit new order to kitchen staff
    this.orderGateway.emitNewOrder(order);

    return order;
  }

  // Update order status
  updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    message?: string,
  ): boolean {
    const order = this.orders.get(orderId);
    if (!order) {
      this.logger.warn(`Order not found: ${orderId}`);
      return false;
    }

    const oldStatus = order.status;
    order.status = status;

    // Update estimated ready time based on status
    if (status === OrderStatus.IN_PROGRESS) {
      order.estimatedReadyTime = new Date(Date.now() + 10 * 60000); // 10 minutes from now
    } else if (status === OrderStatus.READY) {
      order.estimatedReadyTime = new Date(); // Ready now
    }

    this.logger.log(
      `Updated order ${orderId} status: ${oldStatus} -> ${status}`,
    );

    // Emit status update to connected clients
    this.orderGateway.emitOrderStatusUpdate(orderId, {
      orderId,
      status,
      estimatedReadyTime: order.estimatedReadyTime,
      message: message || `status_changed_to_${status.toLowerCase()}`,
    });

    return true;
  }

  // Get order by ID
  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  // Get all orders
  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  // Get orders by status
  getOrdersByStatus(status: OrderStatus): Order[] {
    return Array.from(this.orders.values()).filter(
      (order) => order.status === status,
    );
  }

  // Simulate kitchen workflow (for PoC demonstration)
  simulateKitchenWorkflow() {
    this.logger.log('Starting kitchen workflow simulation...');

    const pendingOrders = this.getOrdersByStatus(OrderStatus.PENDING);
    const inProgressOrders = this.getOrdersByStatus(OrderStatus.IN_PROGRESS);

    // Process pending orders
    if (pendingOrders.length > 0) {
      const order = pendingOrders[0];
      this.updateOrderStatus(
        order.id,
        OrderStatus.IN_PROGRESS,
        'kitchen_started_preparing',
      );

      // Simulate cooking time
      setTimeout(() => {
        this.updateOrderStatus(
          order.id,
          OrderStatus.READY,
          'order_ready_for_pickup',
        );
      }, 15000); // 15 seconds for demo
    }

    // Process in-progress orders
    if (inProgressOrders.length > 0) {
      const order = inProgressOrders[0];
      this.updateOrderStatus(
        order.id,
        OrderStatus.READY,
        'Your order is ready for pickup!',
      );
    }
  }

  // Get order statistics
  getOrderStats() {
    const allOrders = this.getAllOrders();
    const stats = {
      total: allOrders.length,
      pending: allOrders.filter((o) => o.status === OrderStatus.PENDING).length,
      inProgress: allOrders.filter((o) => o.status === OrderStatus.IN_PROGRESS)
        .length,
      ready: allOrders.filter((o) => o.status === OrderStatus.READY).length,
      completed: allOrders.filter((o) => o.status === OrderStatus.COMPLETED)
        .length,
    };

    return stats;
  }
}
