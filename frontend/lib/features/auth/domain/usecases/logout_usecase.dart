import '../../../../core/domain/usecase.dart';
import '../repositories/auth_repository.dart';

/// Use case: Logout
/// Encapsulates the business logic for user logout
class LogoutUseCase implements UseCaseNoInput<void> {
  final AuthRepository _repository;

  LogoutUseCase(this._repository);

  @override
  Future<void> call() {
    return _repository.logout();
  }
}
