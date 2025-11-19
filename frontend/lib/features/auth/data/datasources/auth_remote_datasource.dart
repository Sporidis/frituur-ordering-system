/// Contract for remote authentication data source
abstract class AuthRemoteDataSource {
  Future<Map<String, dynamic>> login(String username, String password);
  Future<Map<String, dynamic>> getUserProfile(String token);
}
