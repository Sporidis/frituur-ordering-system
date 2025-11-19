import 'package:flutter/foundation.dart';
import '../../domain/entities/auth_user.dart';
import '../../domain/usecases/login_usecase.dart';
import '../../domain/usecases/logout_usecase.dart';
import '../../domain/usecases/get_auth_status_usecase.dart';

/// Auth Provider (ViewModel)
/// Manages authentication state and exposes it to the UI
class AuthProvider extends ChangeNotifier {
  final LoginUseCase _loginUseCase;
  final LogoutUseCase _logoutUseCase;
  final GetAuthStatusUseCase _getAuthStatusUseCase;

  AuthUser? _user;
  bool _isLoading = false;
  String? _error;

  AuthProvider({
    required LoginUseCase loginUseCase,
    required LogoutUseCase logoutUseCase,
    required GetAuthStatusUseCase getAuthStatusUseCase,
  }) : _loginUseCase = loginUseCase,
       _logoutUseCase = logoutUseCase,
       _getAuthStatusUseCase = getAuthStatusUseCase;

  // Getters
  AuthUser? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String? get role => _user?.role;
  String? get username => _user?.username;

  /// Initialize auth status on app start
  Future<void> initialize() async {
    _isLoading = true;
    notifyListeners();

    _user = await _getAuthStatusUseCase();

    _isLoading = false;
    notifyListeners();
  }

  /// Login with username and password
  Future<bool> login(String username, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await _loginUseCase(
        LoginParams(username: username, password: password),
      );
      _isLoading = false;
      notifyListeners();
      return _user != null;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Logout current user
  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    await _logoutUseCase();
    _user = null;
    _error = null;

    _isLoading = false;
    notifyListeners();
  }

  /// Get current auth token
  Future<String?> getToken() async {
    if (_user != null) {
      return _user!.token;
    }
    // Fallback to repository if user not loaded
    return null;
  }
}
