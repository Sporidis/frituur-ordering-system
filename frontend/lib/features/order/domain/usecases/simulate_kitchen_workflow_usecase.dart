import '../../../../core/domain/usecase.dart';
import '../../../../core/utils/result.dart';
import '../../domain/repositories/order_repository.dart';

/// Use case: Simulate Kitchen Workflow
class SimulateKitchenWorkflowUseCase
    implements UseCase<SimulateKitchenWorkflowParams, Result<bool>> {
  final OrderRepository _repository;

  SimulateKitchenWorkflowUseCase(this._repository);

  @override
  Future<Result<bool>> call(SimulateKitchenWorkflowParams params) {
    return _repository.simulateKitchenWorkflow(params.token);
  }
}

class SimulateKitchenWorkflowParams {
  final String? token;

  const SimulateKitchenWorkflowParams({this.token});
}
