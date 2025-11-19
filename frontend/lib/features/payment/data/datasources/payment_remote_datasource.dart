import '../../domain/entities.dart';

/// Contract for remote payment data source
abstract class PaymentRemoteDataSource {
  Future<void> initializeStripe();

  Future<PaymentIntent?> createPaymentIntent({
    required double amount,
    String currency,
    String? orderId,
    String? customerId,
  });

  Future<PaymentResult> processPayment({
    required String clientSecret,
    required String customerName,
    required String paymentIntentId,
  });

  Future<PaymentIntent?> getPaymentIntent(String paymentIntentId);

  Future<Refund?> createRefund({
    required String paymentIntentId,
    double? amount,
    String? reason,
  });
}
