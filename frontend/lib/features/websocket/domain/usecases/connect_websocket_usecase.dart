import '../../../../core/domain/usecase.dart';
import '../../../../core/utils/result.dart';
import '../../domain/repositories/websocket_repository.dart';

/// Use case: Connect to WebSocket
class ConnectWebSocketUseCase implements UseCaseNoInput<void> {
  final WebSocketRepository _repository;

  ConnectWebSocketUseCase(this._repository);

  @override
  Future<void> call() {
    return _repository.connect().then((result) {
      if (result is ErrorResult) {
        throw Exception(result.message);
      }
    });
  }
}
