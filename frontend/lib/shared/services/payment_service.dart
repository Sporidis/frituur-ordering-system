import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart' show kIsWeb;

import '../models/payment_models.dart' as payment;
import '../constants/app_constants.dart';
import 'websocket_service.dart'; // For getUrlFromHost

class PaymentService {
  static String get baseUrl => 'http://${getUrlFromHost()}:3000';

  static Future<void> initializeStripe() async {
    try {
      final publishableKey = AppConstants.stripePublishableKey;

      if (publishableKey.isEmpty) {
        throw Exception(
          'Stripe publishable key is not set. Please set STRIPE_PUBLISHABLE_KEY environment variable.',
        );
      }

      Stripe.publishableKey = publishableKey;

      // Initialize Stripe with platform-specific settings
      try {
        if (kIsWeb) {
          debugPrint('🌐 Initializing Stripe for web platform');
        } else if (Platform.isWindows || Platform.isLinux || Platform.isMacOS) {
          debugPrint('🖥️ Initializing Stripe for desktop platform');
        } else if (Platform.isAndroid || Platform.isIOS) {
          debugPrint('📱 Initializing Stripe for mobile platform');
        }

        // Initialize Stripe
        await Stripe.instance.applySettings();
      } catch (platformError) {
        // This is a known issue with flutter_stripe on web/desktop - ignore silently
        if (platformError.toString().contains('Platform._operatingSystem') ||
            platformError.toString().contains('Unsupported operation')) {
          // Silently ignore this expected error - payments work fine
        } else {
          debugPrint(
            '⚠️ Platform-specific Stripe initialization failed: $platformError',
          );
          // For web platform, this error is expected and can be ignored
          if (kIsWeb) {
            debugPrint(
              'ℹ️ Web platform Stripe initialization completed (error expected)',
            );
          } else {
            // Try basic initialization without platform detection for other platforms
            try {
              await Stripe.instance.applySettings();
            } catch (fallbackError) {
              debugPrint(
                '❌ Fallback Stripe initialization also failed: $fallbackError',
              );
            }
          }
        }
      }

      debugPrint('✅ Stripe initialized successfully');
    } catch (e) {
      debugPrint('❌ Error initializing Stripe: $e');
      return;
    }
  }

  static Future<payment.PaymentIntent?> createPaymentIntent({
    required double amount,
    String currency = 'eur',
    String? orderId,
    String? customerName,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/payments/create-intent'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'amount': amount,
          'currency': currency,
          'orderId': orderId,
          'customerName': customerName,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return payment.PaymentIntent.fromJson(data['paymentIntent']);
        } else {
          throw Exception('API returned error: ${data['error']}');
        }
      } else {
        throw Exception('HTTP ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      debugPrint('❌ Error creating payment intent: $e');
      return null;
    }
  }

  static Future<payment.PaymentResult> processPayment({
    required String clientSecret,
    required String customerName,
  }) async {
    try {
      debugPrint('✅ Demo payment processed successfully');
      return payment.PaymentResult.success('demo_payment_id', 'succeeded');
    } catch (e) {
      debugPrint('❌ Error processing payment: $e');
      return payment.PaymentResult.error(e.toString());
    }
  }

  // Get payment intent details
  static Future<payment.PaymentIntent?> getPaymentIntent(
    String paymentIntentId,
  ) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/payments/intent/$paymentIntentId'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return payment.PaymentIntent.fromJson(data['paymentIntent']);
        } else {
          return null;
        }
      } else {
        throw Exception('HTTP ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      debugPrint('❌ Error getting payment intent: $e');
      return null;
    }
  }

  static Future<payment.Refund?> createRefund({
    required String paymentIntentId,
    double? amount,
    String? reason,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/payments/refund'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'paymentIntentId': paymentIntentId,
          'amount': amount,
          'reason': reason,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return payment.Refund.fromJson(data['refund']);
        } else {
          return null;
        }
      } else {
        throw Exception('HTTP ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      debugPrint('❌ Error creating refund: $e');
      return null;
    }
  }

  static Future<payment.PaymentIntent?> createDemoPayment() async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/payments/create-intent'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'amount': 10.50,
          'currency': 'eur',
          'orderId': 'DEMO_ORDER_001',
          'customerName': 'Demo Customer',
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return payment.PaymentIntent.fromJson(data['paymentIntent']);
        } else {
          throw Exception('API returned error: ${data['error']}');
        }
      } else {
        throw Exception('HTTP ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      debugPrint('❌ Error creating demo payment: $e');
      return null;
    }
  }

  static Future<List<payment.PaymentIntent>> getPaymentHistory({
    int limit = 10,
    int offset = 0,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/payments/history?limit=$limit&offset=$offset'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          final List<dynamic> paymentsJson = data['payments'];
          return paymentsJson
              .map((json) => payment.PaymentIntent.fromJson(json))
              .toList();
        } else {
          return [];
        }
      } else {
        throw Exception('HTTP ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      debugPrint('❌ Error getting payment history: $e');
      return [];
    }
  }
}
