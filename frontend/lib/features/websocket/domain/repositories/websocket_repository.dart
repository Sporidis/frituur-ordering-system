import 'dart:async';
import 'package:frituur_ordering_system/features/order/mod.dart';

import '../entities.dart';
import '../../../../core/utils/result.dart';

abstract class WebSocketRepository {
  // Connection management
  Future<Result<void>> connect();
  Future<Result<void>> disconnect();
  bool get isConnected;
  Stream<bool> get connectionStream;

  // Order room management
  Future<Result<void>> joinOrderRoom(String orderId);
  Future<Result<void>> leaveOrderRoom(String orderId);
  String? get currentOrderId;

  // Order management
  List<Order> get orders;
  Stream<List<Order>> get ordersStream;
  Future<Result<Order?>> getOrderById(String orderId);
  Future<Result<void>> addOrder(Order order);
  Future<Result<void>> clearOrders();

  // Status updates
  Stream<OrderStatusUpdate> get orderStatusStream;

  // PoC testing features
  Future<Result<void>> pingServer();
  Future<Result<void>> requestConnectionStats();
  Stream<ServerPong> get pongStream;
  Stream<ConnectionStats> get connectionStatsStream;
}
