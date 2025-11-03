import '../../../shared/services/payment_service.dart';
import '../../../core/utils/result.dart';
import '../domain/entities.dart';
import '../domain/repositories/payment_repository.dart';

class HttpPaymentRepository implements PaymentRepository {
  @override
  Future<Result<PaymentIntent>> createPaymentIntent({
    required double amount,
    String currency = 'eur',
    String? orderId,
    String? customerName,
  }) async {
    final intent = await PaymentService.createPaymentIntent(
      amount: amount,
      currency: currency,
      orderId: orderId,
      customerName: customerName,
    );
    return intent != null
        ? Success(intent)
        : const ErrorResult('Failed to create payment intent');
  }

  @override
  Future<Result<PaymentResult>> processPayment({
    required String clientSecret,
    required String customerName,
    required String paymentIntentId,
  }) async {
    final result = await PaymentService.processPayment(
      clientSecret: clientSecret,
      customerName: customerName,
      paymentIntentId: paymentIntentId,
    );
    return Success(result);
  }

  @override
  Future<Result<Refund>> refund({
    required String paymentIntentId,
    double? amount,
    String? reason,
  }) async {
    final refund = await PaymentService.createRefund(
      paymentIntentId: paymentIntentId,
      amount: amount,
      reason: reason,
    );
    return refund != null
        ? Success(refund)
        : const ErrorResult('Refund failed');
  }

  @override
  Future<Result<PaymentIntent>> getPaymentIntent(String id) async {
    final intent = await PaymentService.getPaymentIntent(id);
    return intent != null
        ? Success(intent)
        : const ErrorResult('Payment intent not found');
  }
}
