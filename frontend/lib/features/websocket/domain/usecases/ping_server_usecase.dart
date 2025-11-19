import '../../../../core/domain/usecase.dart';
import '../../../../core/utils/result.dart';
import '../../domain/repositories/websocket_repository.dart';

/// Use case: Ping server
class PingServerUseCase implements UseCaseNoInput<void> {
  final WebSocketRepository _repository;

  PingServerUseCase(this._repository);

  @override
  Future<void> call() {
    return _repository.pingServer().then((result) {
      if (result is ErrorResult) {
        throw Exception(result.message);
      }
    });
  }
}
