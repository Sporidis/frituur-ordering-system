import 'package:flutter/foundation.dart';

/// Log levels for different types of messages
enum LogLevel { debug, info, warning, error }

/// Centralized logging service
/// Provides structured logging with different levels
class Logger {
  static LogLevel _minLevel = kDebugMode ? LogLevel.debug : LogLevel.info;

  /// Set minimum log level (logs below this level will be ignored)
  static void setMinLevel(LogLevel level) {
    _minLevel = level;
  }

  /// Log a debug message (development only)
  static void debug(String message, [Object? error, StackTrace? stackTrace]) {
    if (_shouldLog(LogLevel.debug)) {
      _log(LogLevel.debug, message, error, stackTrace);
    }
  }

  /// Log an info message
  static void info(String message, [Object? error, StackTrace? stackTrace]) {
    if (_shouldLog(LogLevel.info)) {
      _log(LogLevel.info, message, error, stackTrace);
    }
  }

  /// Log a warning message
  static void warning(String message, [Object? error, StackTrace? stackTrace]) {
    if (_shouldLog(LogLevel.warning)) {
      _log(LogLevel.warning, message, error, stackTrace);
    }
  }

  /// Log an error message
  static void error(String message, [Object? error, StackTrace? stackTrace]) {
    if (_shouldLog(LogLevel.error)) {
      _log(LogLevel.error, message, error, stackTrace);
    }
  }

  static bool _shouldLog(LogLevel level) {
    return level.index >= _minLevel.index;
  }

  static void _log(
    LogLevel level,
    String message,
    Object? error,
    StackTrace? stackTrace,
  ) {
    final prefix = _getPrefix(level);
    final timestamp = DateTime.now().toIso8601String();

    if (kDebugMode) {
      debugPrint('$prefix [$timestamp] $message');
      if (error != null) {
        debugPrint('  Error: $error');
      }
      if (stackTrace != null) {
        debugPrint('  StackTrace: $stackTrace');
      }
    } else {
      debugPrint('$prefix [$timestamp] $message');
      if (error != null) {
        debugPrint('  Error: $error');
      }
      if (stackTrace != null) {
        debugPrint('  StackTrace: $stackTrace');
      }
    }
  }

  static String _getPrefix(LogLevel level) {
    switch (level) {
      case LogLevel.debug:
        return '🐛 DEBUG';
      case LogLevel.info:
        return 'ℹ️  INFO';
      case LogLevel.warning:
        return '⚠️  WARN';
      case LogLevel.error:
        return '❌ ERROR';
    }
  }
}
