import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

/**
 * TypeORM entity for OrderItem
 * Maps to PostgreSQL order_items table
 */
@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column({ name: 'order_id' })
  orderId: string;
}
