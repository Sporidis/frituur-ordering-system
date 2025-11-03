import { Injectable, Logger, Optional, Inject } from '@nestjs/common';
import { Order, OrderItem, OrderStatus } from './domain/order.types';
import { OrderEntity } from './domain/order.entity';
import { OrderRepository } from './domain/repositories/order.repository';
import { OrderTrackingGateway } from './infrastructure/order-tracking.gateway';

@Injectable()
export class OrderService implements OrderRepository {
  private logger: Logger = new Logger('OrderService');
  private orders: Map<string, Order> = new Map();
  private orderCounter = 1;

  constructor(
    @Optional()
    @Inject(OrderTrackingGateway)
    private readonly gateway?: OrderTrackingGateway,
  ) {}

  createOrder(
    customerName: string,
    items: Omit<OrderItem, 'id'>[],
    totalAmount?: number,
  ): Order {
    const orderId = `#${this.orderCounter.toString().padStart(3, '0')}`;
    this.orderCounter++;
    const entity = new OrderEntity({
      id: orderId,
      customerName,
      items,
      totalAmount,
    });
    this.orders.set(orderId, entity);
    this.logger.log(`Created new order: ${orderId}`);

    // Emit WebSocket event for new order
    if (this.gateway) {
      this.gateway.emitNewOrder(entity);
    }

    return entity;
  }

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
    // Delegate status logic to entity when possible
    if (order instanceof OrderEntity) {
      order.updateStatus(status);
    } else {
      // Fallback for plain object
      (order as Order).status = status;
      if (status === OrderStatus.IN_PROGRESS) {
        (order as Order).estimatedReadyTime = new Date(Date.now() + 10 * 60000);
      } else if (status === OrderStatus.READY) {
        (order as Order).estimatedReadyTime = new Date();
      }
    }

    this.logger.log(
      `Updated order ${orderId} status: ${oldStatus} -> ${status} ${message ? '(' + message + ')' : ''}`,
    );

    // Emit WebSocket event for status update
    if (this.gateway) {
      this.gateway.emitOrderStatusUpdate(orderId, order);
    }

    return true;
  }

  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  getOrdersByStatus(status: OrderStatus): Order[] {
    return Array.from(this.orders.values()).filter(
      (order) => order.status === status,
    );
  }

  getOrderStats() {
    const allOrders = this.getAllOrders();
    const stats = {
      totalOrders: allOrders.length,
      pendingOrders: allOrders.filter((o) => o.status === OrderStatus.PENDING)
        .length,
      inProgressOrders: allOrders.filter(
        (o) => o.status === OrderStatus.IN_PROGRESS,
      ).length,
      readyOrders: allOrders.filter((o) => o.status === OrderStatus.READY)
        .length,
      completedOrders: allOrders.filter(
        (o) => o.status === OrderStatus.COMPLETED,
      ).length,
      totalRevenue: allOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    };
    return stats;
  }
}
