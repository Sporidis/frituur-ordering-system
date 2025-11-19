import '../../../../core/domain/usecase.dart';
import '../../data/datasources/payment_remote_datasource.dart';

/// Use case: Initialize Stripe
class InitializeStripeUseCase implements UseCaseNoInput<void> {
  final PaymentRemoteDataSource _dataSource;

  InitializeStripeUseCase(this._dataSource);

  @override
  Future<void> call() {
    return _dataSource.initializeStripe();
  }
}
