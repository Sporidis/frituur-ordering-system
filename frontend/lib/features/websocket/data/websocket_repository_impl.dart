import 'dart:async';

import 'package:frituur_ordering_system/features/order/mod.dart';
import 'package:frituur_ordering_system/features/websocket/data/datasources/websocket_datasource.dart';
import 'package:frituur_ordering_system/features/websocket/domain/repositories/websocket_repository.dart';
import 'package:frituur_ordering_system/features/websocket/domain/entities.dart';
import 'package:frituur_ordering_system/core/utils/result.dart';

class WebSocketRepositoryImpl implements WebSocketRepository {
  final WebSocketDataSource _dataSource;
  final List<Order> _orders = [];

  WebSocketRepositoryImpl(this._dataSource) {
    // Listen to new orders from data source
    _dataSource.newOrderStream.listen((order) {
      if (!_orders.any((o) => o.id == order.id)) {
        _orders.add(order);
      }
    });
  }

  @override
  Future<Result<void>> connect() async {
    try {
      await _dataSource.connect();
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to connect: $e');
    }
  }

  @override
  Future<Result<void>> disconnect() async {
    try {
      await _dataSource.disconnect();
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to disconnect: $e');
    }
  }

  @override
  bool get isConnected => _dataSource.isConnected;

  @override
  Stream<bool> get connectionStream => _dataSource.connectionStream;

  @override
  Future<Result<void>> joinOrderRoom(String orderId) async {
    try {
      await _dataSource.joinOrderRoom(orderId);
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to join order room: $e');
    }
  }

  @override
  Future<Result<void>> leaveOrderRoom(String orderId) async {
    try {
      await _dataSource.leaveOrderRoom(orderId);
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to leave order room: $e');
    }
  }

  @override
  String? get currentOrderId => _dataSource.currentOrderId;

  @override
  List<Order> get orders => List.unmodifiable(_orders);

  @override
  Stream<List<Order>> get ordersStream async* {
    yield List.unmodifiable(_orders);
    await for (final _ in _dataSource.newOrderStream) {
      yield List.unmodifiable(_orders);
    }
  }

  @override
  Future<Result<Order?>> getOrderById(String orderId) async {
    try {
      final order = _orders.firstWhere(
        (o) => o.id == orderId,
        orElse: () => throw Exception('Order not found'),
      );
      return Success(order);
    } catch (e) {
      return ErrorResult('Failed to get order: $e');
    }
  }

  @override
  Future<Result<void>> addOrder(Order order) async {
    try {
      if (!_orders.any((o) => o.id == order.id)) {
        _orders.add(order);
      }
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to add order: $e');
    }
  }

  @override
  Future<Result<void>> clearOrders() async {
    try {
      _orders.clear();
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to clear orders: $e');
    }
  }

  @override
  Stream<OrderStatusUpdate> get orderStatusStream =>
      _dataSource.orderStatusStream;

  @override
  Future<Result<void>> pingServer() async {
    try {
      await _dataSource.pingServer();
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to ping server: $e');
    }
  }

  @override
  Future<Result<void>> requestConnectionStats() async {
    try {
      await _dataSource.requestConnectionStats();
      return const Success(null);
    } catch (e) {
      return ErrorResult('Failed to request connection stats: $e');
    }
  }

  @override
  Stream<ServerPong> get pongStream => _dataSource.pongStream;

  @override
  Stream<ConnectionStats> get connectionStatsStream =>
      _dataSource.connectionStatsStream;
}
