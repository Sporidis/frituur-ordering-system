import {
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Injectable } from '@nestjs/common';

/**
 * Base WebSocket gateway class that provides common functionality
 * for all WebSocket gateways in the application
 */
@Injectable()
export abstract class BaseGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  protected server: Server;

  protected logger: Logger;
  protected connectedClients = new Map<string, Socket>();

  constructor(gatewayName: string) {
    this.logger = new Logger(gatewayName);
  }

  handleConnection(client: Socket): void {
    this.connectedClients.set(client.id, client);
    this.logger.log(`Client connected: ${client.id}`);

    client.emit('connection_confirmed', {
      clientId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket): void {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  isClientConnected(clientId: string): boolean {
    return this.connectedClients.has(clientId);
  }

  getClient(clientId: string): Socket | undefined {
    return this.connectedClients.get(clientId);
  }

  broadcast(event: string, data: any): void {
    this.server.emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  emitToClient(clientId: string, event: string, data: any): void {
    const client = this.connectedClients.get(clientId);
    if (client) {
      client.emit(event, {
        ...data,
        timestamp: new Date().toISOString(),
      });
    } else {
      this.logger.warn(`Client ${clientId} not found for event ${event}`);
    }
  }

  emitToRoom(room: string, event: string, data: any): void {
    this.server.to(room).emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
}
