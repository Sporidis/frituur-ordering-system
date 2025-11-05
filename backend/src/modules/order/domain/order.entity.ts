import { Order, OrderItem, OrderStatus } from './order.types';

export class OrderEntity implements Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  estimatedReadyTime: Date;
  createdAt: Date;

  constructor(params: {
    id: string;
    customerName: string;
    items: Omit<OrderItem, 'id'>[];
    createdAt?: Date;
    totalAmount?: number;
  }) {
    this.id = params.id;
    this.customerName = params.customerName;
    this.createdAt = params.createdAt ?? new Date();
    this.items = params.items.map((item, index) => ({
      id: `item_${params.id}_${index}`,
      ...item,
    }));
    this.totalAmount =
      params.totalAmount ?? OrderEntity.calculateTotal(this.items);
    this.status = OrderStatus.PENDING;
    this.estimatedReadyTime = OrderEntity.estimateReadyTime(
      this.createdAt,
      this.items.length,
    );
  }

  static calculateTotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  static calculateTotalWithTax(
    items: Array<{ price: number; quantity: number }>,
    taxRate: number = 0.06,
  ): { subtotal: number; tax: number; total: number } {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = Number((subtotal * taxRate).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));
    return { subtotal, tax, total };
  }

  static estimateReadyTime(from: Date, itemCount: number): Date {
    return new Date(from.getTime() + (5 + itemCount * 2) * 60000);
  }

  updateStatus(newStatus: OrderStatus) {
    this.status = newStatus;
    if (newStatus === OrderStatus.IN_PROGRESS) {
      this.estimatedReadyTime = new Date(Date.now() + 10 * 60000);
    } else if (newStatus === OrderStatus.READY) {
      this.estimatedReadyTime = new Date();
    }
  }
}
