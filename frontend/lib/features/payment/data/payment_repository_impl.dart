import 'package:frituur_ordering_system/features/payment/data/datasources/payment_remote_datasource.dart';

import '../../../core/utils/result.dart';
import '../domain/entities.dart';
import '../domain/repositories/payment_repository.dart';

class PaymentRepositoryImpl implements PaymentRepository {
  final PaymentRemoteDataSource _dataSource;

  PaymentRepositoryImpl(this._dataSource);

  @override
  Future<Result<PaymentIntent>> createPaymentIntent({
    required double amount,
    String currency = 'eur',
    String? orderId,
    String? customerId,
  }) async {
    final intent = await _dataSource.createPaymentIntent(
      amount: amount,
      currency: currency,
      orderId: orderId,
      customerId: customerId,
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
    final result = await _dataSource.processPayment(
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
    final refund = await _dataSource.createRefund(
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
    final intent = await _dataSource.getPaymentIntent(id);
    return intent != null
        ? Success(intent)
        : const ErrorResult('Payment intent not found');
  }
}
