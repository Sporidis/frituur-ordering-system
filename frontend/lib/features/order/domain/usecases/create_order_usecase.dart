import '../../../../core/domain/usecase.dart';
import '../../../../core/utils/result.dart';
import '../../domain/repositories/order_repository.dart';

/// Use case: Create Order
class CreateOrderUseCase
    implements UseCase<CreateOrderParams, Result<Map<String, dynamic>>> {
  final OrderRepository _repository;

  CreateOrderUseCase(this._repository);

  @override
  Future<Result<Map<String, dynamic>>> call(CreateOrderParams params) {
    return _repository.createOrder(
      customerName: params.customerName,
      items: params.items,
    );
  }
}

class CreateOrderParams {
  final String customerName;
  final List<Map<String, dynamic>> items;

  const CreateOrderParams({required this.customerName, required this.items});
}
