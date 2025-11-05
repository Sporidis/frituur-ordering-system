export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  READY = 'ready',
  COMPLETED = 'completed',
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  estimatedReadyTime: Date;
  createdAt: Date;
}

export interface OrderStatusUpdate {
  orderId: string;
  status: OrderStatus;
  estimatedReadyTime?: Date;
  message?: string;
}
