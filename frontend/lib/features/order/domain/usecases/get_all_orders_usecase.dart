import '../../../../core/domain/usecase.dart';
import '../../../../core/utils/result.dart';
import '../../domain/entities.dart';
import '../../domain/repositories/order_repository.dart';

/// Use case: Get All Orders
class GetAllOrdersUseCase implements UseCaseNoInput<Result<List<Order>>> {
  final OrderRepository _repository;

  GetAllOrdersUseCase(this._repository);

  @override
  Future<Result<List<Order>>> call() {
    return _repository.getAllOrders();
  }
}
