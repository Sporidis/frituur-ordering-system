import '../../../../core/domain/usecase.dart';
import '../entities/auth_user.dart';
import '../repositories/auth_repository.dart';

/// Use case: Login
/// Encapsulates the business logic for user login
class LoginUseCase implements UseCase<LoginParams, AuthUser?> {
  final AuthRepository _repository;

  LoginUseCase(this._repository);

  @override
  Future<AuthUser?> call(LoginParams params) {
    return _repository.login(params.username, params.password);
  }
}

/// Input parameters for LoginUseCase
class LoginParams {
  final String username;
  final String password;

  const LoginParams({required this.username, required this.password});
}
