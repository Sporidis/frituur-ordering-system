import '../entities/auth_user.dart';

/// Repository contract for authentication operations
/// This interface defines what the auth repository can do, not how it does it
abstract class AuthRepository {
  /// Login with username and password
  /// Returns AuthUser if successful, null otherwise
  Future<AuthUser?> login(String username, String password);

  /// Logout the current user
  Future<void> logout();

  /// Get current authentication status
  /// Returns AuthUser if authenticated, null otherwise
  Future<AuthUser?> getAuthStatus();

  /// Get current auth token
  Future<String?> getToken();
}
