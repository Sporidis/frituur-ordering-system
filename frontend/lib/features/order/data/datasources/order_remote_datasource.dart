import '../../domain/entities.dart';

/// Contract for remote order data source
abstract class OrderRemoteDataSource {
  Future<Map<String, dynamic>> createOrder({
    required String customerName,
    required List<Map<String, dynamic>> items,
  });

  Future<List<Order>> getAllOrders();

  Future<Order?> getOrderById(String orderId);

  Future<bool> updateOrderStatus({
    required String orderId,
    required OrderStatus status,
    String? message,
  });

  Future<List<Order>> createSampleOrders();

  Future<Map<String, dynamic>?> getOrderStats();

  Future<bool> simulateKitchenWorkflow(String? token);
}
