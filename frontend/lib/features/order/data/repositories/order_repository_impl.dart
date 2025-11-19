import '../../domain/repositories/order_repository.dart';
import '../../domain/entities.dart';
import '../datasources/order_remote_datasource.dart';
import '../../../../core/utils/result.dart';

class OrderRepositoryImpl implements OrderRepository {
  final OrderRemoteDataSource _dataSource;

  OrderRepositoryImpl(this._dataSource);

  @override
  Future<Result<Map<String, dynamic>>> createOrder({
    required String customerName,
    required List<Map<String, dynamic>> items,
  }) async {
    try {
      final result = await _dataSource.createOrder(
        customerName: customerName,
        items: items,
      );
      return Success(result);
    } catch (e) {
      return ErrorResult('Failed to create order: $e');
    }
  }

  @override
  Future<Result<List<Order>>> getAllOrders() async {
    try {
      final orders = await _dataSource.getAllOrders();
      return Success(orders);
    } catch (e) {
      return ErrorResult('Failed to get orders: $e');
    }
  }

  @override
  Future<Result<Order?>> getOrderById(String orderId) async {
    try {
      final order = await _dataSource.getOrderById(orderId);
      return Success(order);
    } catch (e) {
      return ErrorResult('Failed to get order: $e');
    }
  }

  @override
  Future<Result<bool>> updateOrderStatus({
    required String orderId,
    required OrderStatus status,
    String? message,
  }) async {
    try {
      final success = await _dataSource.updateOrderStatus(
        orderId: orderId,
        status: status,
        message: message,
      );
      return Success(success);
    } catch (e) {
      return ErrorResult('Failed to update order status: $e');
    }
  }

  @override
  Future<Result<List<Order>>> createSampleOrders() async {
    try {
      final orders = await _dataSource.createSampleOrders();
      return Success(orders);
    } catch (e) {
      return ErrorResult('Failed to create sample orders: $e');
    }
  }

  @override
  Future<Result<Map<String, dynamic>?>> getOrderStats() async {
    try {
      final stats = await _dataSource.getOrderStats();
      return Success(stats);
    } catch (e) {
      return ErrorResult('Failed to get order stats: $e');
    }
  }

  @override
  Future<Result<bool>> simulateKitchenWorkflow(String? token) async {
    try {
      final success = await _dataSource.simulateKitchenWorkflow(token);
      return Success(success);
    } catch (e) {
      return ErrorResult('Failed to simulate kitchen workflow: $e');
    }
  }
}
