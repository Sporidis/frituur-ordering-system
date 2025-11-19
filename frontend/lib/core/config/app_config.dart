import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Application configuration
/// Centralizes all configuration values and environment-dependent logic
class AppConfig {
  String get baseUrl {
    final host = _getHost();
    return 'http://$host:3000';
  }

  String get webSocketUrl {
    final host = _getHost();
    return 'http://$host:3000';
  }

  String get stripePublishableKey {
    return dotenv.env['STRIPE_PUBLISHABLE_KEY'] ?? '';
  }

  String get jwtSecret {
    return dotenv.env['JWT_SECRET'] ?? 'dev_secret_key_123';
  }

  String _getHost() {
    if (kIsWeb) return 'localhost';
    if (Platform.isAndroid) return '10.0.2.2';
    if (Platform.isIOS) return 'localhost';
    return 'localhost';
  }
}
