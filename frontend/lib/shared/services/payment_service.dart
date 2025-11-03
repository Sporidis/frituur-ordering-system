import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:http/http.dart' as http;

import '../models/payment_models.dart' as payment;
import '../../core/constants/app_constants.dart';
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
      if (kIsWeb) {
        debugPrint(
          '🌐 Stripe: web platform detected (no native init required)',
        );
      } else if (Platform.isAndroid || Platform.isIOS) {
        try {
          debugPrint('📱 Stripe: initializing for mobile platform');
          await Stripe.instance.applySettings();
        } catch (platformError) {
          debugPrint('⚠️ Stripe mobile init failed: $platformError');
        }
      } else if (Platform.isWindows || Platform.isLinux || Platform.isMacOS) {
        // flutter_stripe has limited/nonexistent support on some desktop targets.
        // Skip native initialization and rely on server-side confirmation.
        debugPrint(
          '🖥️ Stripe: desktop platform detected; skipping native init',
        );
      }

      debugPrint('✅ Stripe initialized');
    } catch (e) {
      // Do not treat as fatal on web; just log
      debugPrint('ℹ️ Stripe init notice: $e');
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
    required String paymentIntentId,
  }) async {
    try {
      // Use server-side confirmation on web and desktop; native confirm on mobile only
      if (kIsWeb ||
          Platform.isWindows ||
          Platform.isLinux ||
          Platform.isMacOS) {
        // On web, use backend to confirm with a test payment method
        final resp = await http.post(
          Uri.parse('$baseUrl/payments/process'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'paymentId': paymentIntentId,
            'paymentMethodId': 'pm_card_visa',
          }),
        );
        if (resp.statusCode == 200) {
          final data = jsonDecode(resp.body);
          if (data['success'] == true) {
            return payment.PaymentResult.success(
              data['payment']['id'] ?? paymentIntentId,
              data['payment']['status'] ?? 'succeeded',
            );
          }
          return payment.PaymentResult.error(
            data['error']?.toString() ?? 'Payment failed',
          );
        }
        return payment.PaymentResult.error(
          'HTTP ${resp.statusCode}: ${resp.body}',
        );
      }

      await Stripe.instance.confirmPayment(
        paymentIntentClientSecret: clientSecret,
        data: const PaymentMethodParams.card(
          paymentMethodData: PaymentMethodData(),
        ),
      );

      return payment.PaymentResult.success('payment_confirmed', 'succeeded');
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

      if (response.statusCode == 200 || response.statusCode == 201) {
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
