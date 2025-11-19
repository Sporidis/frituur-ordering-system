import '../../../../core/domain/usecase.dart';
import '../entities/auth_user.dart';
import '../repositories/auth_repository.dart';

/// Use case: Get Auth Status
/// Encapsulates the business logic for checking authentication status
class GetAuthStatusUseCase implements UseCaseNoInput<AuthUser?> {
  final AuthRepository _repository;

  GetAuthStatusUseCase(this._repository);

  @override
  Future<AuthUser?> call() {
    return _repository.getAuthStatus();
  }
}
