import '../../../../core/utils/result.dart';
import '../entities.dart';

abstract class PaymentRepository {
  Future<Result<PaymentIntent>> createPaymentIntent({
    required double amount,
    String currency,
    String? orderId,
    String? customerId,
  });

  Future<Result<PaymentResult>> processPayment({
    required String clientSecret,
    required String customerName,
    required String paymentIntentId,
  });

  Future<Result<Refund>> refund({
    required String paymentIntentId,
    double? amount,
    String? reason,
  });

  Future<Result<PaymentIntent>> getPaymentIntent(String id);
}
