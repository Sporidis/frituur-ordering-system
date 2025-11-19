/// Contract for local authentication data source (token storage)
abstract class AuthLocalDataSource {
  Future<void> saveToken(String token);
  Future<String?> getToken();
  Future<void> saveRole(String role);
  Future<String?> getRole();
  Future<void> clear();
}
