import '../../../../core/domain/usecase.dart';
import '../../../../core/utils/result.dart';
import '../../domain/entities.dart';
import '../../domain/repositories/payment_repository.dart';

/// Use case: Create Payment Intent
class CreatePaymentIntentUseCase
    implements UseCase<CreatePaymentIntentParams, Result<PaymentIntent>> {
  final PaymentRepository _repository;

  CreatePaymentIntentUseCase(this._repository);

  @override
  Future<Result<PaymentIntent>> call(CreatePaymentIntentParams params) {
    return _repository.createPaymentIntent(
      amount: params.amount,
      currency: params.currency,
      orderId: params.orderId,
      customerId: params.customerId,
    );
  }
}

class CreatePaymentIntentParams {
  final double amount;
  final String currency;
  final String? orderId;
  final String? customerId;

  const CreatePaymentIntentParams({
    required this.amount,
    this.currency = 'eur',
    this.orderId,
    this.customerId,
  });
}
