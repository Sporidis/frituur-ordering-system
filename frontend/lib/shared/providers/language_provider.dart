import 'package:flutter/material.dart';

class LanguageProvider extends ChangeNotifier {
  Locale _currentLocale = const Locale('en', '');

  Locale get currentLocale => _currentLocale;

  void setLocale(Locale locale) {
    if (_currentLocale != locale) {
      _currentLocale = locale;
      notifyListeners();
    }
  }

  void toggleLanguage() {
    if (_currentLocale.languageCode == 'en') {
      setLocale(const Locale('nl', ''));
    } else {
      setLocale(const Locale('en', ''));
    }
  }

  String get currentLanguageName {
    switch (_currentLocale.languageCode) {
      case 'nl':
        return 'Nederlands';
      case 'en':
      default:
        return 'English';
    }
  }

  bool get isEnglish => _currentLocale.languageCode == 'en';
  bool get isDutch => _currentLocale.languageCode == 'nl';
}
