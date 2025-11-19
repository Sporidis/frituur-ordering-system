import '../../domain/entities/auth_user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';
import '../datasources/auth_local_datasource.dart';

/// Repository implementation
/// Coordinates between remote and local data sources
class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final AuthLocalDataSource _localDataSource;

  AuthRepositoryImpl(this._remoteDataSource, this._localDataSource);

  @override
  Future<AuthUser?> login(String username, String password) async {
    try {
      final loginResponse = await _remoteDataSource.login(username, password);
      final token = loginResponse['access_token'] as String;

      // Save token
      await _localDataSource.saveToken(token);

      // Get user profile to get role and ID
      final profileResponse = await _remoteDataSource.getUserProfile(token);
      final role = profileResponse['role'] as String? ?? 'admin';
      final userId = profileResponse['userId'] as String? ?? '';

      // Save role
      await _localDataSource.saveRole(role);

      return AuthUser(id: userId, username: username, role: role, token: token);
    } catch (e) {
      return null;
    }
  }

  @override
  Future<void> logout() async {
    await _localDataSource.clear();
  }

  @override
  Future<AuthUser?> getAuthStatus() async {
    final token = await _localDataSource.getToken();
    if (token == null) return null;

    try {
      final profileResponse = await _remoteDataSource.getUserProfile(token);
      final role =
          await _localDataSource.getRole() ??
          profileResponse['role'] as String? ??
          'admin';
      final userId = profileResponse['userId'] as String? ?? '';
      final username = profileResponse['username'] as String? ?? '';

      return AuthUser(id: userId, username: username, role: role, token: token);
    } catch (e) {
      // Token might be invalid, clear it
      await _localDataSource.clear();
      return null;
    }
  }

  @override
  Future<String?> getToken() async {
    return _localDataSource.getToken();
  }
}
