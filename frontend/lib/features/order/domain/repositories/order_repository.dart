import '../../../../core/utils/result.dart';
import '../entities.dart';

/// Repository contract for order operations
abstract class OrderRepository {
  Future<Result<Map<String, dynamic>>> createOrder({
    required String customerName,
    required List<Map<String, dynamic>> items,
  });

  Future<Result<List<Order>>> getAllOrders();

  Future<Result<Order?>> getOrderById(String orderId);

  Future<Result<bool>> updateOrderStatus({
    required String orderId,
    required OrderStatus status,
    String? message,
  });

  Future<Result<List<Order>>> createSampleOrders();

  Future<Result<Map<String, dynamic>?>> getOrderStats();

  Future<Result<bool>> simulateKitchenWorkflow(String? token);
}
