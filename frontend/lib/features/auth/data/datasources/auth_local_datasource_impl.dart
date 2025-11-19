import 'package:shared_preferences/shared_preferences.dart';
import 'auth_local_datasource.dart';

class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  static const String _tokenKey = 'auth_token';
  static const String _roleKey = 'user_role';

  final SharedPreferences _prefs;

  AuthLocalDataSourceImpl(this._prefs);

  @override
  Future<void> saveToken(String token) async {
    await _prefs.setString(_tokenKey, token);
  }

  @override
  Future<String?> getToken() async {
    return _prefs.getString(_tokenKey);
  }

  @override
  Future<void> saveRole(String role) async {
    await _prefs.setString(_roleKey, role);
  }

  @override
  Future<String?> getRole() async {
    return _prefs.getString(_roleKey);
  }

  @override
  Future<void> clear() async {
    await _prefs.remove(_tokenKey);
    await _prefs.remove(_roleKey);
  }
}
