import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

// Order status types
export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  READY = 'ready',
  COMPLETED = 'completed',
}

// Order interface
export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  estimatedReadyTime: Date;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// WebSocket events
export interface OrderStatusUpdate {
  orderId: string;
  status: OrderStatus;
  estimatedReadyTime?: Date;
  message?: string;
}

export interface JoinOrderRoomPayload {
  orderId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*', // In production, specify your frontend URL
  },
})
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('OrderGateway');
  private connectedClients: Map<string, Set<string>> = new Map(); // orderId -> Set of socketIds

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Remove client from all order rooms
    this.connectedClients.forEach((clients, orderId) => {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.connectedClients.delete(orderId);
      }
    });
  }

  @SubscribeMessage('join_order_room')
  handleJoinOrderRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinOrderRoomPayload,
  ) {
    const { orderId } = payload;

    // Join the specific order room
    client.join(`order_${orderId}`);

    // Track connected clients for this order
    if (!this.connectedClients.has(orderId)) {
      this.connectedClients.set(orderId, new Set());
    }
    this.connectedClients.get(orderId)!.add(client.id);

    this.logger.log(`Client ${client.id} joined order room: ${orderId}`);

    // Send confirmation back to client
    client.emit('joined_order_room', {
      orderId,
      message: 'Successfully joined order room',
    });
  }

  @SubscribeMessage('leave_order_room')
  handleLeaveOrderRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinOrderRoomPayload,
  ) {
    const { orderId } = payload;

    // Leave the specific order room
    client.leave(`order_${orderId}`);

    // Remove client from tracking
    const clients = this.connectedClients.get(orderId);
    if (clients) {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.connectedClients.delete(orderId);
      }
    }

    this.logger.log(`Client ${client.id} left order room: ${orderId}`);
  }

  // Method to emit order status updates to all clients in an order room
  emitOrderStatusUpdate(orderId: string, update: OrderStatusUpdate) {
    this.logger.log(
      `Emitting order status update for order ${orderId}:`,
      update,
    );

    this.server.to(`order_${orderId}`).emit('order_status_updated', {
      ...update,
      timestamp: new Date().toISOString(),
    });
  }

  // Method to emit new orders to kitchen staff
  emitNewOrder(order: Order) {
    this.logger.log(`Emitting new order to kitchen:`, order);

    this.server.to('kitchen_room').emit('new_order', {
      ...order,
      timestamp: new Date().toISOString(),
    });
  }

  // Method to get connected clients count for an order
  getConnectedClientsCount(orderId: string): number {
    return this.connectedClients.get(orderId)?.size || 0;
  }

  // Method to get all connected clients
  getAllConnectedClients(): Map<string, number> {
    const result = new Map<string, number>();
    this.connectedClients.forEach((clients, orderId) => {
      result.set(orderId, clients.size);
    });
    return result;
  }
}
