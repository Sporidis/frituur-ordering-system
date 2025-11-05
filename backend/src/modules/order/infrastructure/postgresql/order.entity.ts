import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderItemEntity } from './order-item.entity';

/**
 * TypeORM entity for Order
 * Maps to PostgreSQL orders table
 */
@Entity('orders')
export class OrderEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  customerName: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'in_progress', 'ready', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  estimatedReadyTime: Date;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items: OrderItemEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
