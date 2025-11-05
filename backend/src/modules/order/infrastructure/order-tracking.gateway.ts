import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { BaseGateway } from '@shared/infrastructure/websockets';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: false,
  },
  namespace: '/',
})
export class OrderTrackingGateway extends BaseGateway {
  private orderRooms = new Map<string, Set<string>>(); // orderId -> clientIds

  constructor() {
    super('OrderTrackingGateway');
  }

  override handleConnection(client: Socket): void {
    super.handleConnection(client);
  }

  override handleDisconnect(client: Socket): void {
    // Remove client from all order rooms
    for (const [orderId, clients] of this.orderRooms.entries()) {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.orderRooms.delete(orderId);
      }
    }

    super.handleDisconnect(client);
  }

  @SubscribeMessage('join_order_room')
  handleJoinOrderRoom(client: Socket, payload: { orderId: string }) {
    const { orderId } = payload;

    if (!this.orderRooms.has(orderId)) {
      this.orderRooms.set(orderId, new Set());
    }

    this.orderRooms.get(orderId)!.add(client.id);
    client.join(`order:${orderId}`);

    this.logger.log(`Client ${client.id} joined order room: ${orderId}`);

    client.emit('joined_order_room', {
      orderId,
      message: `Joined room for order ${orderId}`,
    });
  }

  @SubscribeMessage('leave_order_room')
  handleLeaveOrderRoom(client: Socket, payload: { orderId: string }) {
    const { orderId } = payload;

    if (this.orderRooms.has(orderId)) {
      this.orderRooms.get(orderId)!.delete(client.id);
      if (this.orderRooms.get(orderId)!.size === 0) {
        this.orderRooms.delete(orderId);
      }
    }

    client.leave(`order:${orderId}`);
    this.logger.log(`Client ${client.id} left order room: ${orderId}`);
  }

  // Public methods to emit events from services
  emitOrderStatusUpdate(orderId: string, order: any) {
    this.emitToRoom(`order:${orderId}`, 'order_status_updated', {
      orderId,
      status: order.status,
      order,
    });

    this.logger.log(`Emitted status update for order: ${orderId}`);
  }

  emitNewOrder(order: any) {
    this.broadcast('new_order', { order });
    this.logger.log(`Emitted new order event: ${order.id}`);
  }

  // PoC testing methods
  @SubscribeMessage('client_ping')
  handlePing(client: Socket) {
    client.emit('server_pong', {
      timestamp: new Date().toISOString(),
      clientId: client.id,
    });
  }

  @SubscribeMessage('get_connection_stats')
  handleConnectionStats(client: Socket) {
    client.emit('connection_stats', {
      activeConnections: this.connectedClients.size,
      totalConnections: this.connectedClients.size,
      maxConcurrentConnections: this.connectedClients.size,
      orderRooms: Array.from(this.orderRooms.keys()),
    });
  }
}
