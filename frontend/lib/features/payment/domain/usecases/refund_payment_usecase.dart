import '../../../../core/domain/usecase.dart';
import '../../../../core/utils/result.dart';
import '../../domain/entities.dart';
import '../../domain/repositories/payment_repository.dart';

/// Use case: Refund Payment
class RefundPaymentUseCase
    implements UseCase<RefundPaymentParams, Result<Refund>> {
  final PaymentRepository _repository;

  RefundPaymentUseCase(this._repository);

  @override
  Future<Result<Refund>> call(RefundPaymentParams params) {
    return _repository.refund(
      paymentIntentId: params.paymentIntentId,
      amount: params.amount,
      reason: params.reason,
    );
  }
}

class RefundPaymentParams {
  final String paymentIntentId;
  final double? amount;
  final String? reason;

  const RefundPaymentParams({
    required this.paymentIntentId,
    this.amount,
    this.reason,
  });
}
