import '../../../../core/domain/usecase.dart';
import '../../../../core/utils/result.dart';
import '../../domain/entities.dart';
import '../../domain/repositories/payment_repository.dart';

/// Use case: Process Payment
class ProcessPaymentUseCase
    implements UseCase<ProcessPaymentParams, Result<PaymentResult>> {
  final PaymentRepository _repository;

  ProcessPaymentUseCase(this._repository);

  @override
  Future<Result<PaymentResult>> call(ProcessPaymentParams params) {
    return _repository.processPayment(
      clientSecret: params.clientSecret,
      customerName: params.customerName,
      paymentIntentId: params.paymentIntentId,
    );
  }
}

class ProcessPaymentParams {
  final String clientSecret;
  final String customerName;
  final String paymentIntentId;

  const ProcessPaymentParams({
    required this.clientSecret,
    required this.customerName,
    required this.paymentIntentId,
  });
}
