import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frituur_ordering_system/shared/mod.dart';

void main() {
  group('Language Switch Performance Tests', () {
    test('Language provider switch performance', () {
      final languageProvider = LanguageProvider();

      // Measure language switch time
      final stopwatch = Stopwatch()..start();

      // Switch to Dutch
      languageProvider.setLocale(const Locale('nl', ''));

      stopwatch.stop();
      final switchTime = stopwatch.elapsedMilliseconds;

      debugPrint('Language switch time: ${switchTime}ms');

      // Verify the switch worked
      expect(languageProvider.currentLocale.languageCode, equals('nl'));

      // Performance assertion
      expect(
        switchTime,
        lessThan(10),
        reason: 'Language switch should be under 10ms, was ${switchTime}ms',
      );
    });

    test('Language provider toggle performance', () {
      final languageProvider = LanguageProvider();

      // Measure language toggle time
      final stopwatch = Stopwatch()..start();

      // Toggle language
      languageProvider.toggleLanguage();

      stopwatch.stop();
      final toggleTime = stopwatch.elapsedMilliseconds;

      debugPrint('Language toggle time: ${toggleTime}ms');

      // Verify the toggle worked (should be Dutch now)
      expect(languageProvider.currentLocale.languageCode, equals('nl'));

      // Performance assertion
      expect(
        toggleTime,
        lessThan(10),
        reason: 'Language toggle should be under 10ms, was ${toggleTime}ms',
      );
    });

    test('Multiple language switches performance', () {
      final languageProvider = LanguageProvider();

      // Measure multiple switches
      final stopwatch = Stopwatch()..start();

      // Switch multiple times
      languageProvider.setLocale(const Locale('nl', ''));
      languageProvider.setLocale(const Locale('en', ''));
      languageProvider.setLocale(const Locale('nl', ''));
      languageProvider.setLocale(const Locale('en', ''));

      stopwatch.stop();
      final totalTime = stopwatch.elapsedMilliseconds;
      final avgTime = totalTime / 4;

      debugPrint('Total time for 4 switches: ${totalTime}ms');
      debugPrint('Average time per switch: ${avgTime}ms');

      // Performance assertion
      expect(
        avgTime,
        lessThan(5),
        reason: 'Average language switch should be under 5ms, was ${avgTime}ms',
      );
    });
  });
}
