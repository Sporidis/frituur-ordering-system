import { Injectable, Logger, Optional, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationException } from '@shared/application/exceptions/base.exception';
import { Order, OrderItem, OrderStatus } from '../../domain/order.types';
import { OrderEntity as DomainOrderEntity } from '../../domain/order.entity';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';
import { OrderTrackingGateway } from '../order-tracking.gateway';

/**
 * PostgreSQL implementation of OrderRepository
 * All methods are async for database operations
 */
@Injectable()
export class PostgreSQLOrderRepository implements OrderRepository {
  private logger = new Logger('PostgreSQLOrderRepository');

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly itemRepository: Repository<OrderItemEntity>,
    @Optional()
    @Inject(OrderTrackingGateway)
    private readonly gateway?: OrderTrackingGateway,
  ) {}

  async createOrder(
    customerName: string,
    items: Omit<OrderItem, 'id'>[],
    totalAmount?: number,
  ): Promise<Order> {
    // Generate order ID
    const count = await this.orderRepository.count();
    const orderId = `#${(count + 1).toString().padStart(3, '0')}`;

    // Create order entity
    const orderEntity = this.orderRepository.create({
      id: orderId,
      customerName,
      totalAmount: totalAmount || 0,
      status: OrderStatus.PENDING,
      estimatedReadyTime: new Date(Date.now() + 15 * 60000), // Default 15 minutes
    });

    // Save order
    const savedOrder = await this.orderRepository.save(orderEntity);

    // Create order items
    const itemEntities = items.map((item) =>
      this.itemRepository.create({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        orderId: savedOrder.id,
      }),
    );
    await this.itemRepository.save(itemEntities);

    // Load full order with items
    const fullOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items'],
    });

    if (!fullOrder) {
      throw new ApplicationException(
        'Failed to create order',
        'ORDER_CREATION_FAILED',
      );
    }

    // Convert to domain entity
    const domainEntity = this.mapToDomainEntity(fullOrder);

    this.logger.log(`Created new order: ${orderId}`);

    // Emit WebSocket event
    if (this.gateway) {
      this.gateway.emitNewOrder(domainEntity);
    }

    return domainEntity;
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    message?: string,
  ): Promise<boolean> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items'],
    });

    if (!order) {
      this.logger.warn(`Order not found: ${orderId}`);
      return false;
    }

    const oldStatus = order.status;
    order.status = status;

    // Update estimated ready time based on status
    if (status === OrderStatus.IN_PROGRESS) {
      order.estimatedReadyTime = new Date(Date.now() + 10 * 60000);
    } else if (status === OrderStatus.READY) {
      order.estimatedReadyTime = new Date();
    }

    await this.orderRepository.save(order);

    this.logger.log(
      `Updated order ${orderId} status: ${oldStatus} -> ${status} ${message ? '(' + message + ')' : ''}`,
    );

    // Emit WebSocket event
    if (this.gateway) {
      const domainEntity = this.mapToDomainEntity(order);
      this.gateway.emitOrderStatusUpdate(orderId, domainEntity);
    }

    return true;
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items'],
    });

    if (!order) {
      return undefined;
    }

    return this.mapToDomainEntity(order);
  }

  async getAllOrders(): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => this.mapToDomainEntity(order));
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
    return stats;
  }

  /**
   * Map TypeORM entity to domain entity
   */
  private mapToDomainEntity(orderEntity: OrderEntity): Order {
    const items: OrderItem[] = (orderEntity.items || []).map((item) => ({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price.toString()),
      quantity: item.quantity,
    }));

    // Create domain entity with constructor params
    const domainEntity = new DomainOrderEntity({
      id: orderEntity.id,
      customerName: orderEntity.customerName,
      items,
      totalAmount: parseFloat(orderEntity.totalAmount.toString()),
      createdAt: orderEntity.createdAt,
    });

    // Set additional properties that aren't in constructor
    domainEntity.status = orderEntity.status as OrderStatus;
    domainEntity.estimatedReadyTime =
      orderEntity.estimatedReadyTime || new Date();

    return domainEntity;
  }
}
