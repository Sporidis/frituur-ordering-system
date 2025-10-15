import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

import '../models/order_models.dart';

// Get the url from host
String getUrlFromHost() {
  if (kIsWeb) return 'localhost';
  if (Platform.isAndroid) return '10.0.2.2';
  if (Platform.isIOS) return 'localhost';
  return 'localhost';
}

class ApiService {
  static String get baseUrl => 'http://${getUrlFromHost()}:3000';

  // Create a new order
  static Future<Map<String, dynamic>> createOrder({
    required String customerName,
    required List<Map<String, dynamic>> items,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/orders'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'customerName': customerName, 'items': items}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to create order: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('❌ API Error creating order: $e');
      rethrow;
    }
  }

  // Get all orders
  static Future<List<Order>> getAllOrders() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/orders'));

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
      debugPrint('❌ API Error getting orders: $e');
      rethrow;
    }
  }

  // Get order by ID
  static Future<Order?> getOrderById(String orderId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/orders/$orderId'));

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
      debugPrint('❌ API Error getting order: $e');
      return null;
    }
  }

  // Update order status
  static Future<bool> updateOrderStatus({
    required String orderId,
    required OrderStatus status,
    String? message,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/orders/$orderId/status'),
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
      debugPrint('❌ API Error updating order status: $e');
      return false;
    }
  }

  // Create sample orders
  static Future<List<Order>> createSampleOrders() async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/orders/demo/create-sample'),
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
      debugPrint('❌ API Error creating sample orders: $e');
      rethrow;
    }
  }

  // Simulate kitchen workflow
  static Future<bool> simulateKitchenWorkflow() async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/orders/simulate/kitchen-workflow'),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return data['success'] == true;
      } else {
        return false;
      }
    } catch (e) {
      debugPrint('❌ API Error simulating kitchen workflow: $e');
      return false;
    }
  }

  // Get order statistics
  static Future<Map<String, dynamic>?> getOrderStats() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/orders/stats/overview'),
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
      debugPrint('❌ API Error getting order stats: $e');
      return null;
    }
  }
}
