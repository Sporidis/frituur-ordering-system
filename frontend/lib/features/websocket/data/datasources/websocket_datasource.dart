import 'dart:async';
import 'package:frituur_ordering_system/features/order/mod.dart';
import '../../domain/entities.dart';

/// Contract for WebSocket data source
abstract class WebSocketDataSource {
  Future<void> connect();
  Future<void> disconnect();
  bool get isConnected;
  Stream<bool> get connectionStream;

  Future<void> joinOrderRoom(String orderId);
  Future<void> leaveOrderRoom(String orderId);
  String? get currentOrderId;

  Stream<Order> get newOrderStream;
  Stream<OrderStatusUpdate> get orderStatusStream;

  Future<void> pingServer();
  Future<void> requestConnectionStats();
  Stream<ServerPong> get pongStream;
  Stream<ConnectionStats> get connectionStatsStream;
}
