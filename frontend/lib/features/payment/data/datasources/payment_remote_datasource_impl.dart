import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_stripe/flutter_stripe.dart' as stripe;
import 'package:http/http.dart' as http;
import '../../../../core/mod.dart';
import '../../domain/entities.dart';
import 'payment_remote_datasource.dart';

class PaymentRemoteDataSourceImpl implements PaymentRemoteDataSource {
  final http.Client _client;
  final AppConfig _config;

  PaymentRemoteDataSourceImpl(this._client, this._config);

  @override
  Future<void> initializeStripe() async {
    try {
      final publishableKey = _config.stripePublishableKey;

      if (publishableKey.isEmpty) {
        throw Exception(
          'Stripe publishable key is not set. Please set STRIPE_PUBLISHABLE_KEY environment variable.',
        );
      }

      stripe.Stripe.publishableKey = publishableKey;

      // Initialize Stripe with platform-specific settings
      if (kIsWeb) {
        Logger.info('Stripe: web platform detected (no native init required)');
      } else if (Platform.isAndroid || Platform.isIOS) {
        try {
          Logger.info('Stripe: initializing for mobile platform');
          await stripe.Stripe.instance.applySettings();
        } catch (platformError) {
          Logger.warning('Stripe mobile init failed', platformError);
        }
      } else if (Platform.isWindows || Platform.isLinux || Platform.isMacOS) {
        Logger.info('Stripe: desktop platform detected; skipping native init');
      }

      Logger.info('Stripe initialized');
    } catch (e) {
      Logger.warning('Stripe init notice', e);
    }
  }

  @override
  Future<PaymentIntent?> createPaymentIntent({
    required double amount,
    String currency = 'eur',
    String? orderId,
    String? customerId,
  }) async {
    try {
      // Backend requires customerId and orderId - generate defaults if not provided
      final finalCustomerId =
          customerId ?? 'customer_${DateTime.now().millisecondsSinceEpoch}';
      final finalOrderId =
          orderId ?? 'order_${DateTime.now().millisecondsSinceEpoch}';

      final body = <String, dynamic>{
        'amount': amount,
        'currency': currency.toUpperCase(),
        'customerId': finalCustomerId,
        'orderId': finalOrderId,
      };

      final response = await _client.post(
        Uri.parse('${_config.baseUrl}/payments/create-intent'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return PaymentIntent.fromJson(data['paymentIntent']);
        } else {
          throw Exception('API returned error: ${data['error']}');
        }
      } else {
        throw Exception('HTTP ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      Logger.error('Error creating payment intent', e);
      return null;
    }
  }

  @override
  Future<PaymentResult> processPayment({
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
        final resp = await _client.post(
          Uri.parse('${_config.baseUrl}/payments/process'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'paymentId': paymentIntentId,
            'paymentMethodId': 'pm_card_visa',
            'customerName': customerName,
          }),
        );
        if (resp.statusCode == 200) {
          final data = jsonDecode(resp.body);
          if (data['success'] == true) {
            return PaymentResult.success(
              data['payment']['id'] ?? paymentIntentId,
              data['payment']['status'] ?? 'succeeded',
            );
          }
          return PaymentResult.error(
            data['error']?.toString() ?? 'Payment failed',
          );
        }
        return PaymentResult.error('HTTP ${resp.statusCode}: ${resp.body}');
      }

      await stripe.Stripe.instance.confirmPayment(
        paymentIntentClientSecret: clientSecret,
        data: const stripe.PaymentMethodParams.card(
          paymentMethodData: stripe.PaymentMethodData(),
        ),
      );

      return PaymentResult.success('payment_confirmed', 'succeeded');
    } catch (e) {
      Logger.error('Error processing payment', e);
      return PaymentResult.error(e.toString());
    }
  }

  @override
  Future<PaymentIntent?> getPaymentIntent(String paymentIntentId) async {
    try {
      final response = await _client.get(
        Uri.parse('${_config.baseUrl}/payments/intent/$paymentIntentId'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return PaymentIntent.fromJson(data['paymentIntent']);
        } else {
          return null;
        }
      } else {
        throw Exception('HTTP ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      Logger.error('Error getting payment intent', e);
      return null;
    }
  }

  @override
  Future<Refund?> createRefund({
    required String paymentIntentId,
    double? amount,
    String? reason,
  }) async {
    try {
      final response = await _client.post(
        Uri.parse('${_config.baseUrl}/payments/refund'),
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
          return Refund.fromJson(data['refund']);
        } else {
          return null;
        }
      } else {
        throw Exception('HTTP ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      Logger.error('Error creating refund', e);
      return null;
    }
  }
}
