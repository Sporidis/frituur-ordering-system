import '../../../../core/domain/usecase.dart';
import '../../../../core/utils/result.dart';
import '../../domain/repositories/websocket_repository.dart';

/// Use case: Join order room
class JoinOrderRoomUseCase implements UseCase<JoinOrderRoomParams, void> {
  final WebSocketRepository _repository;

  JoinOrderRoomUseCase(this._repository);

  @override
  Future<void> call(JoinOrderRoomParams params) {
    return _repository.joinOrderRoom(params.orderId).then((result) {
      if (result is ErrorResult) {
        throw Exception(result.message);
      }
    });
  }
}

class JoinOrderRoomParams {
  final String orderId;

  const JoinOrderRoomParams({required this.orderId});
}
