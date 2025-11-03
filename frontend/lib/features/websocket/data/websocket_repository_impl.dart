import 'dart:async';

import '../../../shared/services/websocket_service.dart';
import '../../../shared/models/ws_models.dart';
import '../../../core/utils/result.dart';
import '../domain/entities.dart';
import '../domain/repositories/websocket_repository.dart';

class SocketIoWebSocketRepository implements WebSocketRepository {
  final WebSocketService _webSocketService;

  SocketIoWebSocketRepository(this._webSocketService);

  @override
  Future<Result<void>> connect() async {
    try {
      await _webSocketService.connect();
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to connect: $e');
    }
  }

  @override
  Future<Result<void>> disconnect() async {
    try {
      _webSocketService.disconnect();
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to disconnect: $e');
    }
  }

  @override
  bool get isConnected => _webSocketService.isConnected;

  @override
  Stream<bool> get connectionStream async* {
    yield _webSocketService.isConnected;
    await for (final _ in _webSocketService.orderStatusStream) {
      yield _webSocketService.isConnected;
    }
  }

  @override
  Future<Result<void>> joinOrderRoom(String orderId) async {
    try {
      _webSocketService.joinOrderRoom(orderId);
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to join order room: $e');
    }
  }

  @override
  Future<Result<void>> leaveOrderRoom(String orderId) async {
    try {
      _webSocketService.leaveOrderRoom(orderId);
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to leave order room: $e');
    }
  }

  @override
  String? get currentOrderId => _webSocketService.currentOrderId;

  @override
  List<Order> get orders => _webSocketService.orders;

  @override
  Stream<List<Order>> get ordersStream async* {
    yield _webSocketService.orders;
    await for (final _ in _webSocketService.orderStatusStream) {
      yield _webSocketService.orders;
    }
  }

  @override
  Future<Result<Order?>> getOrderById(String orderId) async {
    try {
      final order = _webSocketService.getOrderById(orderId);
      return Success(order);
    } catch (e) {
      return ErrorResult('Failed to get order: $e');
    }
  }

  @override
  Future<Result<void>> addOrder(Order order) async {
    try {
      _webSocketService.addOrder(order);
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to add order: $e');
    }
  }

  @override
  Future<Result<void>> clearOrders() async {
    try {
      _webSocketService.clearOrders();
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to clear orders: $e');
    }
  }

  @override
  Stream<OrderStatusUpdate> get orderStatusStream =>
      _webSocketService.orderStatusStream;

  @override
  Future<Result<void>> pingServer() async {
    try {
      _webSocketService.pingServer();
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to ping server: $e');
    }
  }

  @override
  Future<Result<void>> requestConnectionStats() async {
    try {
      _webSocketService.requestConnectionStats();
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to request connection stats: $e');
    }
  }

  @override
  Stream<ServerPong> get pongStream => _webSocketService.pongStream;

  @override
  Stream<ConnectionStats> get connectionStatsStream =>
      _webSocketService.connectionStatsStream;
}
