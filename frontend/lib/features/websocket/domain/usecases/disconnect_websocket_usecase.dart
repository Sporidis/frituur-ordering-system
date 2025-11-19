import '../../../../core/domain/usecase.dart';
import '../../../../core/utils/result.dart';
import '../../domain/repositories/websocket_repository.dart';

/// Use case: Disconnect from WebSocket
class DisconnectWebSocketUseCase implements UseCaseNoInput<void> {
  final WebSocketRepository _repository;

  DisconnectWebSocketUseCase(this._repository);

  @override
  Future<void> call() {
    return _repository.disconnect().then((result) {
      if (result is ErrorResult) {
        throw Exception(result.message);
      }
    });
  }
}
