/// Auth domain entity
class AuthUser {
  final String id;
  final String username;
  final String role;
  final String token;

  const AuthUser({
    required this.id,
    required this.username,
    required this.role,
    required this.token,
  });
}
