import '../../../../core/domain/usecase.dart';
import '../../../../core/utils/result.dart';
import '../../domain/entities.dart';
import '../../domain/repositories/payment_repository.dart';

/// Use case: Get Payment Intent
class GetPaymentIntentUseCase
    implements UseCase<GetPaymentIntentParams, Result<PaymentIntent>> {
  final PaymentRepository _repository;

  GetPaymentIntentUseCase(this._repository);

  @override
  Future<Result<PaymentIntent>> call(GetPaymentIntentParams params) {
    return _repository.getPaymentIntent(params.paymentIntentId);
  }
}

class GetPaymentIntentParams {
  final String paymentIntentId;

  const GetPaymentIntentParams({required this.paymentIntentId});
}
