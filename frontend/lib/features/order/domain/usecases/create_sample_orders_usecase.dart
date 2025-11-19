import '../../../../core/domain/usecase.dart';
import '../../../../core/utils/result.dart';
import '../../domain/entities.dart';
import '../../domain/repositories/order_repository.dart';

/// Use case: Create Sample Orders
class CreateSampleOrdersUseCase implements UseCaseNoInput<Result<List<Order>>> {
  final OrderRepository _repository;

  CreateSampleOrdersUseCase(this._repository);

  @override
  Future<Result<List<Order>>> call() {
    return _repository.createSampleOrders();
  }
}
