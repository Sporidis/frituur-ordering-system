import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/mod.dart';
import '../../domain/entities.dart';
import 'order_remote_datasource.dart';

class OrderRemoteDataSourceImpl implements OrderRemoteDataSource {
  final http.Client _client;
  final AppConfig _config;

  OrderRemoteDataSourceImpl(this._client, this._config);

  @override
  Future<Map<String, dynamic>> createOrder({
    required String customerName,
    required List<Map<String, dynamic>> items,
  }) async {
    try {
      final response = await _client.post(
        Uri.parse('${_config.baseUrl}/orders'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'customerName': customerName, 'items': items}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to create order: ${response.statusCode}');
      }
    } catch (e) {
      Logger.error('API Error creating order', e);
      rethrow;
    }
  }

  @override
  Future<List<Order>> getAllOrders() async {
    try {
      final response = await _client.get(
        Uri.parse('${_config.baseUrl}/orders'),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return (data['orders'] as List)
              .map((orderJson) => Order.fromJson(orderJson))
              .toList();
        } else {
          throw Exception('API returned error: ${data['message']}');
        }
      } else {
        throw Exception('Failed to get orders: ${response.statusCode}');
      }
    } catch (e) {
      Logger.error('API Error getting orders', e);
      rethrow;
    }
  }

  @override
  Future<Order?> getOrderById(String orderId) async {
    try {
      final response = await _client.get(
        Uri.parse('${_config.baseUrl}/orders/$orderId'),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return Order.fromJson(data['order']);
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (e) {
      Logger.error('API Error getting order', e);
      return null;
    }
  }

  @override
  Future<bool> updateOrderStatus({
    required String orderId,
    required OrderStatus status,
    String? message,
  }) async {
    try {
      final response = await _client.patch(
        Uri.parse('${_config.baseUrl}/orders/$orderId/status'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'status': status.name, 'message': message}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return data['success'] == true;
      } else {
        return false;
      }
    } catch (e) {
      Logger.error('API Error updating order status', e);
      return false;
    }
  }

  @override
  Future<List<Order>> createSampleOrders() async {
    try {
      final response = await _client.post(
        Uri.parse('${_config.baseUrl}/orders/demo/create-sample'),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return (data['orders'] as List)
              .map((orderJson) => Order.fromJson(orderJson))
              .toList();
        } else {
          throw Exception('API returned error: ${data['message']}');
        }
      } else {
        throw Exception(
          'Failed to create sample orders: ${response.statusCode}',
        );
      }
    } catch (e) {
      Logger.error('API Error creating sample orders', e);
      rethrow;
    }
  }

  @override
  Future<Map<String, dynamic>?> getOrderStats() async {
    try {
      final response = await _client.get(
        Uri.parse('${_config.baseUrl}/orders/stats/overview'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return data;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (e) {
      Logger.error('API Error getting order stats', e);
      return null;
    }
  }

  @override
  Future<bool> simulateKitchenWorkflow(String? token) async {
    try {
      final headers = <String, String>{'Content-Type': 'application/json'};

      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }

      final response = await _client.post(
        Uri.parse('${_config.baseUrl}/kitchen/simulate'),
        headers: headers,
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return data['success'] == true;
      } else {
        return false;
      }
    } catch (e) {
      Logger.error('API Error simulating kitchen workflow', e);
      return false;
    }
  }
}
