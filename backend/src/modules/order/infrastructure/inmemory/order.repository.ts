import { Injectable, Logger, Optional, Inject } from '@nestjs/common';
import { Order, OrderItem, OrderStatus } from '../../domain/order.types';
import { OrderEntity } from '../../domain/order.entity';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderTrackingGateway } from '../order-tracking.gateway';

@Injectable()
export class InMemoryOrderRepository implements OrderRepository {
  private logger: Logger = new Logger('InMemoryOrderRepository');
  private orders: Map<string, Order> = new Map();
  private orderCounter = 1;

  constructor(
    @Optional()
    @Inject(OrderTrackingGateway)
    private readonly gateway?: OrderTrackingGateway,
  ) {}

  async createOrder(
    customerName: string,
    items: Omit<OrderItem, 'id'>[],
    totalAmount?: number,
  ): Promise<Order> {
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

    // Emit WebSocket event for new order (repository hook after save)
    if (this.gateway) {
      this.gateway.emitNewOrder(entity);
    }

    return Promise.resolve(entity);
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    message?: string,
  ): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) {
      this.logger.warn(`Order not found: ${orderId}`);
      return Promise.resolve(false);
    }

    const oldStatus = order.status;
    // Delegate status logic to entity
    if (order instanceof OrderEntity) {
      order.updateStatus(status);
    } else {
      // Fallback for plain object (should not happen, but for safety)
      order.status = status;
      if (status === OrderStatus.IN_PROGRESS) {
        order.estimatedReadyTime = new Date(Date.now() + 10 * 60000);
      } else if (status === OrderStatus.READY) {
        order.estimatedReadyTime = new Date();
      }
    }

    this.logger.log(
      `Updated order ${orderId} status: ${oldStatus} -> ${status} ${message ? '(' + message + ')' : ''}`,
    );

    // Emit WebSocket event for status update (repository hook after update)
    if (this.gateway) {
      this.gateway.emitOrderStatusUpdate(orderId, order);
    }

    return Promise.resolve(true);
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    return Promise.resolve(this.orders.get(orderId));
  }

  async getAllOrders(): Promise<Order[]> {
    return Promise.resolve(Array.from(this.orders.values()));
  }

  async getOrderStats(): Promise<any> {
    const allOrders = await this.getAllOrders();
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
    return Promise.resolve(stats);
  }
}
